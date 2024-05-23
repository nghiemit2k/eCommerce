const express = require('express');
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler');
const checkoutController = require('../../controller/checkout.controller')
const { authenticationV2 } = require('../../auth/authUtils');
const { cart } = require('../../models/cart.model');

router.post('/review',asyncHandler(checkoutController.checkoutReview))

module.exports = router;
