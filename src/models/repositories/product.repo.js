
const { Types } = require('mongoose');
const { product, electronic, clothing } = require('../../models/product.model');
const {getSelectData, unSelectData} = require('../../utils/index.js')
const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const publishProductByShop = async ({ product_shop, product_id} ) => {
    const foundShop = await product.findOneAndUpdate({
        // product_shop: new ObjectId(product_shop),
        // _id: new ObjectId(product_id)
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    }, 
    { $set: { isDraft: false, isPublish: true } },
    { new: true })   // để trả về tài liệu đã được sửa đổi)
     
    if (!foundShop) return null;
    return foundShop;
}

const unPublishProductByShop = async ({ product_shop, product_id}) => {
    const foundShop = await product.findOneAndUpdate({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    }, {$set: {isDraft: true, isPublish: false} }, {new: true})
    if(!foundShop) return null;
    return foundShop;
}
const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query).populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}

const searchProductByUser = async ({ keySearch }) => {
    const results = await product.find(
        {
           isPublish: true,
            $text: { $search: keySearch }
        },
        { score: { $meta: 'textScore' }}
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

    return results;
};
const findAllProducts = async ({limit, sort,page, filter, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort ==='ctime' ?{_id: -1}: {_id:1}
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    return products
}
const findProduct = async ({product_id, unSelect}) => {
    return await product.findById(product_id).select(unSelectData(unSelect))
}
const updateProductById = async ({productId, bodyUpdate, model, isNew= true}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}
module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
}