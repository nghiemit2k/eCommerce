const express = require('express');
const router = express.Router();
const AccessController = require('../../controller/access.controller');
//signUp
router.post('/shop/signUp',AccessController.signUp);

module.exports = router;