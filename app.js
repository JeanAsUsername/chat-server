'use strict'

const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      csurf = require('csurf'),
      port = process.env.PORT || 3000,
      session = require('cookie-session'),
      cors = require('cors'),
      normalRoutes = require('./routes/normal-routes'),
      processRoutes = require('./routes/process-routes'),
      conf = require('./conf.json'),
      app = express()

app
    .set('port', port)
    .use(morgan('dev'))
    .use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json())
    .use(session({
        name: 'session',
        secret: conf.app.cookieSecret,
        httpOnly: true
    }))
    .use(cors({
        origin: ['http://localhost:8080', 'http://192.168.1.104:8080'],
        credentials: true
    }))
    .use('/', normalRoutes)
    .use('/process', csurf(), processRoutes)

module.exports = app
    