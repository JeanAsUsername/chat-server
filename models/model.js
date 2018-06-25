'use strict'

const mongoose = require('mongoose'),
      userSchema = require('./../schemas/user'),
      messageSchema = require('./../schemas/message'),
      conf = require('../conf.json'),
      // import model methods
      user = require('./methods/user'),
      message = require('./methods/messages')

class model {

    constructor() {

        //set mongoose models

        const userModel = mongoose.model('user', userSchema),
            messageModel = mongoose.model('message', messageSchema),
            // set mongoose connection
            Connection = new Promise((resolve, reject) => {

                mongoose.connect(`mongodb://${conf.mongodb.user}:${conf.mongodb.password}@ds245228.mlab.com:45228/${conf.mongodb.database}`)

                mongoose.connection
                    // error attempting to connect to mongodb
                    .on('error', () => {
                        reject(new Error('Error al conectar con la base de datos'))
                    })
                    // successfully connected to mongodb
                    .once('open', () => {
                        console.log('Conexion con la base de datos establecida')
                        resolve()
                    })
            })

        Connection
        // use model methods
        .then(() => {
            //user
            this.createUser =  (credentials) => user.createUser(userModel, credentials)
            this.searchUser = (email) => user.searchUser(userModel, email)
            this.updateUser = (id, credentials) => user.updateUser(userModel, id, credentials)
            this.deleteUser = (id, controller) => user.deleteUser(userModel, id, controller)
            //message
            this.getMessages = () => message.getMessages(messageModel)
            this.addMessage = (data) => message.addMessage(messageModel, data)
            this.deleteUserMessages = (id) => message.deleteUserMessages(messageModel, id) 


        })
        .catch((err) => {
            console.log(err)
        })

    }

}

module.exports = new model()