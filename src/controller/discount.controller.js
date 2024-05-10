const { SuccessResponse } = require("../core/success.response")
const DiscountService = require("../service/discount.service")

class DiscountController {
    createDiscountCode  = async (req,res,next) => {
        new SuccessResponse({
            message: "Discount code created successfully",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodes = async (req, res, next)=> {
        new SuccessResponse({
         message:"Success code found",
         metadata : await DiscountService.getAllDiscountCodeByShop({
            ...req.query,
            shopId: req.user.userId
         })  
        }).send(res)
    }
    getDiscountAmount = async(req, res, next) => {
        new SuccessResponse({
            message:"Success code found",
            metadata: await DiscountService.getDiscountAmount({
               ...req.body
            })
        }).send(res)
    }
    getAllDiscountCodeWithProducts = async (req,res,next) => {
        new SuccessResponse({
            message:"Success code found",
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }

}

module.exports = new DiscountController()