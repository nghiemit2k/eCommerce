const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser');
const app = express()


//init middlewares

app.use(morgan('dev'))
app.use(helmet());
app.use(compression())
//init db
require('./db/init.mongo')
// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()
//init routes
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use('/', require('./routers/index'))

//handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error,req, res, next) => {
    const status = error.status || 500
    return res.status(status).json({
        status:'error',
        code: status,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
});
module.exports = app
