const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const AuthFailureError = require('../core/error.response')
const { findByUserId } = require('../service/keyToken.service')
const { NotFoundError } = require('../core/error.response')
const { request } = require('express')
const { Error } = require('mongoose')
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload,privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err,decode) => {
            if (err) {
                console.log('error verify: '+err)
            } else {
                console.log('decode verify: '+decode)
            }
        })

        return {accessToken,refreshToken}
    } catch (error) {
        
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
    1. check userId missing?
    2.  get access token
    3. verify access token
    4. check user in bds
    5. check keyStore with this userId
    6. ok all => return next
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not found keyStore')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId != decodeUser.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async(token, keySecret) => {
    return await JWT.verify(token, keySecret)
}
module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
}