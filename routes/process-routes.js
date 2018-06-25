'use strict'

const express = require('express'),
      Router = express.Router(),
      controller = require('./../controllers/process-controller')

Router
    .get('/getaccess', controller.csrf)
    .get('/login', controller.login)
    .get('/logout', controller.logout)
    .post('/createuser', controller.createUser)
    .post('/checkUser/', controller.checkUser)


module.exports = Router