'use strict'

const express = require('express'),
      Router = express.Router(),
      controller = require('./../controllers/normal-controller')

Router
      .get('/getmessages', controller.getMessages)


module.exports = Router