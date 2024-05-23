const _ = require('lodash');
const { Types } = require('mongoose')
const { ObjectId } = require('mongodb');
const convertToObjectIdMongodb = id => new ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
}
// ['a','b'] => {a:1,b:2}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
// ['a','b'] => {a:0,b:0}
const unSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] == null) {
            delete obj[key]
        }

    })
    return obj
}
/*
    {
        a:1,
        b:2,
        c:{
            d:3,
            e:4
        }
    } => {
        a:1,
        b:2,
        c.d:3,
        c.e:4
    }
*/
const updateNestObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'Object' && !Array.isArray(obj[k])) {
            const response = updateNestObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = res[a]
            })
        } else {
            final[k] = obj[k]
        }
    })
    return final
}
module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    removeUndefinedObject,
    updateNestObjectParser,
    convertToObjectIdMongodb
}