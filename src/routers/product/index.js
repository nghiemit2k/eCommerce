const express = require('express');
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler');
const ProductController = require('../../controller/product.controller')
const { authenticationV2 } = require('../../auth/authUtils');

router.use(authenticationV2)

router.post('',asyncHandler(ProductController.createProduct))
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))

module.exports = router