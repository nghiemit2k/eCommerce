const dev = {
    app: {
        port: 3000
    }, 
    db: {
        host:   'localhost',
        port:   27017,
        name:   'db',
    }
}

const production = {
    app: {
        port: 3000
    }, 
    db: {
        host:   'localhost',
        port:   27017,
        name:   'dbProduct',
    }
}

const config = {dev, production}
const env = process.env.NODE_ENV ||dev
module.exports = config[env]
