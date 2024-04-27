const {model, Schema, SchemaType} =require('mongoose');
const slugify = require('slugify');
const DOCUMENT_NAME ='Product'
const COLLECTION_NAME ='Products'

const ProductSchema = new Schema({
    product_name: {type: String,required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_slug: String, // quan-jean-cao-cap
    product_price: {type: Number, required: true},
    product_quantity: {type: Number, required: true},
    product_type: {type: String, required: true,enum: ['Electronics','Clothing','Furniture']},
   
    product_shop: {type: Schema.Types.ObjectId, ref:'Shop'},
    product_attributes:{type: Schema.Types.Mixed, required: true},
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1,'Rating must be above 1.0'],
        max: [5,'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations : {type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublish: {type: Boolean, default: false, index: true, select: false}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})
// Document middleware: runs before .save() and .create()
ProductSchema.pre('save',function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next()
})
// create index for search
ProductSchema.index({product_name:'text', product_description:'text'})
// define the product type = clothing
const clothingSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref:'Shop'}
}, {
    collection: 'Clothing',
    timestamps: true
})

const electronicSchema = new Schema({
    manufacturer: {type: String, required: true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref:'Shop'}
}, {
    collection: 'Electronics',
    timestamps: true
})

const furnitureSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref:'Shop'}
}, {
    collection: 'Furniture',
    timestamps: true
})
module.exports = {
    product: model (DOCUMENT_NAME, ProductSchema),
     clothing: model('Clothing', clothingSchema),
     electronic: model('Electronics', electronicSchema),
     furniture: model('Furniture', furnitureSchema)
}


