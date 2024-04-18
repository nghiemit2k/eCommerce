const express = require('express');
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler');
const ProductController = require('../../controller/product.controller')
const { authentication } = require('../../auth/authUtils');

// router.use(authentication)

router.post('',asyncHandler(ProductController.createProduct))

module.exports = router