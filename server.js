'use strict'

const app = require('./app'),
      port = app.get('port'),
      http = require('http').createServer(app),
      socket = require('./websockets/socket')(http)

http
    .listen(port, () => {
        console.log(`Servidor corriendo en el puerto ${port}`)
    })

module.exports = http

