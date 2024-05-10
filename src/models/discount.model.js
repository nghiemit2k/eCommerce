const {model, Schema,Types} = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema({
    discount_name: {type: String, required: true},
    discount_description: {type: String, required: true},
    discount_type: {type: String, default:'fixed_amount'},
    discount_value: {type: String, required: true},
    discount_code: {type: String, required: true},
    discount_start_date: {type: Date, required: true},
    discount_end_date: {type: Date, required: true},
    discount_uses_count: {type: Number, required: true},
    discount_users_used: {type: Array, default:[]},
    discount_max_uses_per_user: {type: Number, required: true},
    discount_min_order_value: {type: Number, required: true},
    discount_shopId: {type: Schema.Types.ObjectId, ref:'Shop'},
    
    discount_is_active: {type: Boolean, required: true},
    discount_applies_to: {type: String, required: true}, enum:['all','specific'],
    discount_product_ids: {type: Array, default:[]},
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

module.exports =  model(DOCUMENT_NAME, discountSchema) 
