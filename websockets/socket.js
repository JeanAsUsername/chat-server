'use strict'

module.exports = (http) => {
    
    const instance = require('socket.io')(http),
        chatSocket = require('./methods/chatSocket'),
        profileSocket = require('./methods/profileSocket')


    // set connections
    chatSocket(instance)
    profileSocket(instance)

}