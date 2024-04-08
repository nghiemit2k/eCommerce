const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const {getInfoData} = require('../utils');
const RoleShop = {
    SHOP:'SHOP',
    WRITER:'WRITER',
    EDITOR:'EDITOR',
    ADMIN:'ADMIN'
}
class AccessService {
    static signUp =  async ({name,email,password}) => {
        try {
            // step 1: check email exists?
            const hodelShop = await shopModel.findOne({email}).lean();
            if(hodelShop) {
                return {
                    code: 'xxx',
                    message: 'Email already exists',
                }
            }
            const passwordHash = await bcrypt(password,10);
            const newShop = await shopModel.create({name,email,password: passwordHash,roles:[RoleShop.SHOP]})

            if(newShop) {
                // created privateKey, publicKey
                // privateKey tao xong dua cho nguoi dung, ko luu privatekey trong he thong, dung sign token
                //publicKey luu vao he thong, dung verification token
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
                await shopModel.updateOne({_id:newShop._id},{privateKey,publicKey})
                console.log({privateKey,publicKey})
                
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop.id,
                    publicKey,
                    privateKey,
                })

                if(!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'keyStore error',
                      
                    }
                }
                const tokens = await createTokenPair({userId: newShop._id,email},publicKey,privateKey)
                console.log(`Create token success`,tokens)
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['_id','name','email'], object: newShop}),
                        tokens
                    }
                }
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            }
        }
    }
}

module.exports = AccessService;