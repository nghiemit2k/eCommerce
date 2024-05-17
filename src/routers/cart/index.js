const express = require('express');
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler');
const cartController = require('../../controller/cart.controller')
const { authenticationV2 } = require('../../auth/authUtils');
const { cart } = require('../../models/cart.model');

router.post('',asyncHandler(cartController.addToCart))
router.delete('',asyncHandler(cartController.delete));
router.post('/update',asyncHandler(cartController.update));
router.get('',asyncHandler(cartController.listToCart));

module.exports = router;
