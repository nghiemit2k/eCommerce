const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const { getInfoData } = require('../utils');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const KeyTokenService = require('./keyToken.service');
const { BadRequestError, ConflictRequestError, ForbiddenError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require("./shop.service");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    /*
    check this token used
    */
    static handlerRefresherToken = async (refreshToken) => {
        // check xem token nay da dc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            // decode xem may la thang nao
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log({ userId, email })
            // xoa tat ca token trong keyStore
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happened!! please relogin')
        }
        // no
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('shop not registered1')
        // verify token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]', { userId, email })
        // check userId
        const foundShop = await shopModel.findByEmail({ email })

        if (!foundShop) throw new AuthFailureError('SHop not registered2')

        // create 1 cap moi
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
        // update token

        await holderToken.update({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: tokens.refreshToken
            }
        })
        return {
            user: { userId, email },
            tokens
        }

    }
    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log(delKey)
        return delKey
    }
    /*
    1.check email in db
    2. match password
    3.create access token & refresh token
    4. generate tokens
    5. get data return login
    */

    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new BadRequestError('Shop not registered')
        }

        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('AUhthenticated password error')

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }), tokens
        }

    }
    static signUp = async ({ name, email, password }) => {


        // step 1: check email exists?
        const hodelShop = await shopModel.findOne({ email }).lean();

        if (hodelShop) {
            throw new BadRequestError('Error: Shop already registered')
        }
        const passwordHash = await bcrypt.hash('password', 10);
        const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] })

        if (newShop) {
            // created privateKey, publicKey
            // privateKey tao xong dua cho nguoi dung, ko luu privatekey trong he thong, dung sign token
            //publicKey luu vao he thong, dung verification token
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            await shopModel.updateOne({ _id: newShop._id }, { privateKey, publicKey })
            console.log({ privateKey, publicKey })

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            })

            if (!keyStore) {
                throw new BadRequestError('Error: Create keyStore error')
                // return {
                //     code: 'xxx',
                //     message: 'keyStore error',

                // }
            }
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log(`Create token success`, tokens)
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }

    }
}

module.exports = AccessService;