const ProductService = require('../service/product.service');
const { SuccessResponse } = require('../core/success.response')

class ProductController {

    createProduct = async (req, res) => {
        new SuccessResponse({
            message: 'Product created successfully',
            metadata: await ProductService.createProduct(req.body.product_type, req.body)
        }).send(res);
    }
}

module.exports = new ProductController();