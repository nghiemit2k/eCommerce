const AccessService = require("../service/access.service")
const { OK, CREATED, SuccessResponse } = require("../core/success.response")
const { response } = require("express")

class AccessController {
    handlerFreshToken = async (req,res, next) => {
        new SuccessResponse({
            message:'get token success',
            metadata: await AccessService.handlerRefresherToken(req.body.refreshToken)
        }).send(res)
    }
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "User logged out successfully",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    signUp = async (req, res, next) => {

        new CREATED({
            message: "User created successfully",
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
        // return res.status(201).json(await AccessService.signUp(req.body))
    }
}

module.exports = new AccessController();