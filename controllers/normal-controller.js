'use strict'
// modules
const jwt = require('jsonwebtoken'),
// model
model  = require('../models/model'),
// config
conf = require('../conf.json')


class normalController {

    constructor() {

        this.getMessages = (req, res, next) => {
            model
            .getMessages()
            .then(messages => {
                res.json(messages)
            })
            .catch(e => {
                console.log('Nos han podido obtener los mensajes')
            })
        }

        this.addMessage = (data) => {

            return new Promise((resolve, reject) => {

                model
                .addMessage(data)
                .then(message => {
                    return resolve(message)
                })
                .catch(e => {
                    reject(e)
                })

            })

        }

    }

}

module.exports = new normalController()