const CheckoutService = require('../service/checkout.service')
const {SuccessResponse} = require('../core/success.response')

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message:'checkout review updated successfully',
            metadata: await CheckoutService.checkoutReview(req.body)
        
        }).send(res)
    }
}

module.exports = new CheckoutController()