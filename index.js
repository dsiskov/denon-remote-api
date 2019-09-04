// init
const port = process.env.PORT || 4000
const express = require('express')

let utils = require('./methods/utils')();
utils.initialize();

// expressApp
const expressApp = express()
const bodyParser = require('body-parser')
expressApp.use(bodyParser.urlencoded({ extended: true }))
expressApp.use(bodyParser.json());

// routes & methods
const denonMethods = require('./methods/denon')()
const apiRoutes = require('./apiRoutes')(express.Router(), denonMethods)

// nb: cors settings must be included before other routes
var cors = require('cors')
expressApp.use(cors())

// initialize routes
expressApp.use('/api/v1', apiRoutes)

// start listening
expressApp.set('trust proxy', '127.0.0.1');
expressApp.listen(port, () => {
	console.log(`listening on port ${port}`)
})