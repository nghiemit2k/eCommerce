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
app.use('/', require('./routers'))

//handling error

module.exports = app
