const mongoose = require('mongoose')
// const {db: {host,name,port}} = require('../config/config.mongodb')
const connectString = 'mongodb+srv://nghiemit:P92z2y3AaHqoZDzu@cluster0.f9bzgdj.mongodb.net/'
const {countConnect}=require('../helpers/check.connect')
class Database {
    constructor() {
        this.connect()
    }

    // connect
    connect(type='mongodb') {
        if(1==1) {
            mongoose.set('debug', true)
            mongoose.set('debug',{color: true})
        }
        mongoose.connect(connectString, {maxPoolSize: 50}). then (_ => console.log('Connected Mongodb success',countConnect()))
        .catch (err => console.log('Failed to connect'))
    }
    static getInstance() {
        if(!Database.instance) { 
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb