const ProductService = require('../service/product.service');
const { SuccessResponse } = require('../core/success.response')

class ProductController {

    createProduct = async (req, res) => {
        new SuccessResponse({
            message: 'Product created successfully',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    publishProductByShop = async (req, res) => {
        new SuccessResponse({
            message: 'Product published successfully',
           
            metadata: await ProductService.publishProductByShop( {
                product_id: req.params.id,
                product_shop: req.user.userId
            })
            
        }).send(res);
    }

    unPublishProductByShop = async (req, res) => {
        new SuccessResponse({
            message: 'Product unpublished successfully',
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }). send(res);
    }
    /**
     * @desc Get all Darfts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON} 
     */
    // query
    getAllDraftsForShop = async (req, res) => {
        new SuccessResponse({
            message: 'Get list Draft success',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }

    getAllPublishForShop = async (req, res) => {
        new SuccessResponse({
            message: 'Get list Publish success',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }

    getListSearchProduct = async (req, res) => {
        console.log(req.body)
        new SuccessResponse({
            message: 'Get list search product success',
            metadata: await ProductService.searchProduct(req.params)
        }).send(res);
    }

    findAllProducts = async (req, res) => {
        new SuccessResponse({
            message: 'Get list product success',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res);
    }

    findProduct = async (req, res) => {
        new SuccessResponse({
            message: 'Get product success',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id
            })
        }).send(res);
    }

    updateProduct = async (req, res) => {
        new SuccessResponse({
            message: 'Update product success',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId,{
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }
}

module.exports = new ProductController();