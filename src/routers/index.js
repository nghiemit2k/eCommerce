const express = require('express');
const router = express.Router();
const {apiKey,permission} = require('../auth/checkAuth')

// check api key
// router.use(apiKey)

router.use('/v1/api',require('./access'))
router.use('/v1/api/product',require('./product'))
// check permissions
// router.use(permission('0000'))

module.exports = router;