const keyTokenModel = require('../models/keytoken.model');

const { Types: { ObjectId } } = require('mongoose')
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey: null;
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new ObjectId(userId) })
    }

    static removeKeyById = async ({ id }) => {
        const result = await keyTokenModel.deleteOne({
            _id: new ObjectId(id)
        })
        return result;
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshedTokenUsed: refreshToken }).lean();
    }

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.findByIdAndDelete(userId)
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    }
}

module.exports = KeyTokenService;

