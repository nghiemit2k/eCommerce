const { product, clothing, electronic } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductByUser, findAllProducts, findProduct, updateProductById } = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestObjectParser } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')
// define factory class to create product

class ProductFactory {
    static productRegistry = {} // key-class
    static registerProductType(type, classRef) {
        this.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).createProduct()
        // switch (type) {
        //     case 'Clothing':
        //         return new Clothing(payload).createProduct()
        //     case 'Electronics':
        //         return new Electronics(payload).createProduct()
        //     default:
        //         throw new BadRequestError(`Invalid product type ${type}`)
        // }
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublish: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublish: true } }) {
        return await findAllProducts({ limit, sort, filter, page, select: ['product_name', 'product_price', 'product_thumb','product_shop'] })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).updateProduct(productId)
    }
}

class Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_type,
        product_shop, product_attributes, product_quantity }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
    }

    // create new product
    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id });
        if (newProduct) {
            await insertInventory({
                product_id: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            })
        }
        return newProduct
    }

    // update product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

// define sub-class 
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError('Cannot create clothing')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Cannot create new product')
        return newProduct
    }

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        if (objectParams.product_attributes) {
            await updateProductById({
                productId,
                bodyUpdate: updateNestObjectParser(objectParams.product_attributes),
                model: clothing
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestObjectParser(objectParams))
        return updateProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronics) throw new BadRequestError('Cannot create electronic')

        const newProduct = await super.createProduct(newElectronics._id)
        if (!newProduct) throw new BadRequestError('Cannot create new product')
        return newProduct
    }
}

// register product types
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);

module.exports = ProductFactory
