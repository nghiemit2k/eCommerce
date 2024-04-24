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
}

module.exports = new ProductController();