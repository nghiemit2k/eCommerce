const { product, clothing, electronic } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
// define factory class to create product
class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case 'Clothing':
                return new Clothing(payload).createProduct()
            case 'Electronics':
                return new Electronics(payload)
            default:
                throw new BadRequestError(`Invalid product type ${type}`)
        }
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
    async createProduct() {
        return await product.create(this)
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError('Cannot create clothing')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Cannot create new product')
        return newProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronic.create(this.product_attributes);
        if (!newElectronics) throw new BadRequestError('Cannot create electronic')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Cannot create new product')
        return newProduct
    }
}
module.exports = ProductFactory
