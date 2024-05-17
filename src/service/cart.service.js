const { NotFoundError } = require('../core/error.response');
const { cart } = require('../models/cart.model');
const { getProductById } = require('../models/repositories/product.repo');


class CartService {

    // START REPO CART
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            }, options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }
    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateSet, options)
    }
    // END REPO
    static async addToCard({ userId, product = {} }) {
        // check cart co ton hay khong
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            // create cart for user
            return await CartService.createUserCart({ userId, product })
        }
        // neu co gio hang, nhung chua co san pham
        if (!userCart.product.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // gio hang ton tai va co san pham nay thi update quantity
        return await CartService.updateUserCartQuantity({ userCart, quantity })

    }

    static async addToCartV2({ userId, shop_order_ids = {} }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) {
            throw new NotFoundError('Product not found')
        }
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }
        if (quantity === 0) {
            //delete
        }
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }
        const deleteCart = await cart.deleteOne(query, updateSet);
        return deleteCart
    }

    static async getListCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean();
    }
}

module.exports = CartService;