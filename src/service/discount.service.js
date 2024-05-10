const { NotFoundError, BadRequestError } = require("../core/error.response");
const discount = require("../models/discount.model");
const { findAllDiscountCodeUnSelect, checkDiscountExists } = require("../models/repositories/discount.repo");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require("./product.service");



class DiscountService {

    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user,users_used
        } = payload;

        // if (new Date() < new Date(start_date) || new Date() > newDate(end_date)) {
        //     throw new BadRequestError('Discount code has expired')
        // }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date")
        }

        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('discount already')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            // discount_max_value: max_value,
            discount_min_order_value: min_order_value || 0,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
            discount_applies_to: applies_to,
            discount_end_date: new Date(end_date),
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses: max_uses,
            discount_is_active: is_active,
            discount_uses_count: uses_count,
            discount_max_uses_per_user: max_uses_per_user,
            discount_start_date: new Date(start_date),

        })
        return newDiscount;

    }
    static async updateDiscountCode() {
        //
    }
    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, limit, page
    }) {
        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount code not exist')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products;
        if (discount_applies_to === 'all') {
            // get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            // get the product ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products;
    }
    static async getAllDiscountCodeByShop({
        limit, page, shopId
    }) {
        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        })
        return discounts;
    }

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount doesn`t exist')

        const {
            discount_is_active,
            discount_max_uses,
            discount_max_uses_per_user,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_type,
            discount_users_used,
            discount_value,
            discount_amount
        } = foundDiscount

        if (!discount_is_active) throw new NotFoundError('Discount expired')
        // if (!discount_max_uses) throw new NotFoundError('Discount are out')

        if (new Date() > new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError('Discount code has expired')
        }

        // check xem code co gia tri toi thieu hay khong
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            if (typeof products !== 'object' || !Array.isArray(products)) {
                throw new TypeError('products must be an array or an object containing product information');
            }
        
            let productArray = [];
        
            // Nếu products là một đối tượng, chuyển đổi thành một mảng
            if (!Array.isArray(products)) {
                productArray.push(products);
            } else {
                productArray = products;
            }
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value}`)

        }
        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUserDiscount) {
                //
            }
        }
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder,
            discount_amount,
            totalPrice: totalOrder - amount
        }
    }
    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })
        return deleted
    }
    static async cancelDisCountCode({ shopId, codeId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError('discount doesnt exist')
        const result = await discount.findByIdAndDelete(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
        return result
    }
}


module.exports = DiscountService;

