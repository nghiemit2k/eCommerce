const {SuccessResponse} = require('../core/success.response');
const CartService = require('../service/cart.service');

class CartController{
  addToCart = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create new cart successfully',
        metadata: await CartService.addToCard(req.body)
      }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update cart successfully',
            metadata: await CartService.addToCartV2(req.body)
          }).send(res)

    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete cart successfully',
            metadata: await CartService.deleteUserCart(req.body)
          }).send(res)

    }

    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'List cart successfully',
            metadata: await CartService.getListCart(req.query)
          }).send(res)
    }
}

module.exports = new CartController();