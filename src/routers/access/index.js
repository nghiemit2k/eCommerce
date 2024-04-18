const express = require('express');
const router = express.Router();
const AccessController = require('../../controller/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

//signUp
router.post('/shop/signUp', asyncHandler(AccessController.signUp));
router.post('/shop/login', asyncHandler(AccessController.login));

//authentication
router.use(authentication)
router.post('/shop/logout', asyncHandler(AccessController.logout));
router.post('/shop/handlerRefreshToken', asyncHandler(AccessController.handlerFreshToken));
router.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'jjjj'
    })
})
module.exports = router;