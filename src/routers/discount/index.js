const express = require('express');
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler');
const discountController = require('../../controller/discount.controller')
const { authenticationV2 } = require('../../auth/authUtils');

router.post('/amount',asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code',asyncHandler(discountController.getAllDiscountCodeWithProducts))


router.use(authenticationV2)

router.post('',asyncHandler(discountController.createDiscountCode))
router.get('',asyncHandler(discountController.getAllDiscountCodeWithProducts))

module.exports = router;
