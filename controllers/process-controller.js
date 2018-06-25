'use strict'
// modules
const bcrypt = require('bcrypt'),
jwt = require('jsonwebtoken'),
// model
model  = require('../models/model'),
// config
conf = require('../conf.json')

class processController {

    constructor() {

        this.csrf = (req, res, next) => {
            res.json({
                "token": `${req.csrfToken()}`
            })
        }

        this.createUser = async (req, res, next) => {

            if (req.session.token) {
                console.log("You're trying to login when you already have a token")
                return
            }

            let errors = new Array()

            Object.entries(req.body).forEach(input => {

                // manage error for every input
                // -----------------------------------------------
                if (input[0] === 'username') {

                    const regex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/

                    if (!regex.test(input[1])) {
                        errors.push({
                            errorType: 'username',
                            input: 'username'
                        })
                    }
                }

                if (input[0] === 'email') {

                    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

                    if (!regex.test(input[1])) {
                        errors.push({
                            errorType: 'email',
                            input: 'email'
                        })
                    }
                }

                if (input[0] === 'password') {

                    const regex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/

                    if (!regex.test(input[1])) {
                        errors.push({
                            errorType: 'password',
                            input: 'password'
                        })
                    }
                }
            })
            // ----------------------------------------------------------
            const credentials = {
                username: req.body.username,
                email: req.body.email,
                color: req.body.color
            }

            // encrypt password
            try {
                const email = await model.searchUser(credentials.email)
                // verify the email don't exist
                if (email) {
                    errors.push({
                        errorType: 'EAIU',// email already in use
                        input: 'email'
                    })
                }
                // send errors if have
                if (errors.length > 0) return res.send({
                    errors,
                    runValidate: true
                })
                const password = await bcrypt.hash(req.body.password, 10)
                credentials.password = password

            } catch(err) {

                console.log(err)
                res.send({
                    serverError: true
                })
                return new Error('Error attempting to create a new user')
            }

            model
                .createUser(credentials)
                .then(user => {
                    // initialize the session
                    const token = jwt.sign({
                        userId: user._id,
                        username: user.username
                    }, conf.auth.secret, {
                        expiresIn: '1h'
                    })

                    req.session.token = token
                    return res.json({
                        "userInfo": {
                            "userId": user._id,
                            "username": user.username,
                            "email": user.email,
                            "color": user.color
                        }
                    })

                })
                .catch(err => {

                    console.log(err)
                    res.send({
                        serverError: true
                    })
                    return new Error('Error attempting to create a new user')
                })
        },

        this.checkUser = async (req, res, next) => {

            const credentials = {
                email: req.body.email,
                password: req.body.password
            }

            try {
                const user = await model.searchUser(credentials.email)
                // check the user exist
                if (!user) return res.json({
                    "login": false
                })
                const password = await bcrypt.compare(credentials.password, user.password)
                // check the password is correct
                if (!password) return res.json({
                    "login": false
                })
                // jwt token
                const token = jwt.sign({
                    userId: user._id,
                    username: user.username
                }, conf.auth.secret, {
                    expiresIn: '1h'
                })
                // verify the session don't exist
                if (req.session.token) {
                    console.log("You're trying to login when you already have a token")
                    return res.json({
                        "login": false
                    })
                }
                // create the session
                req.session.token = token
                return res.json({
                    "login": true,
                    "userId": user._id,
                    "username": user.username,
                    "email": user.email,
                    "color": user.color
                })

            } catch(err) {
                console.log(err)
                res.send({
                    serverError: true
                })
                return new Error('Error attempting to auth')
            }
           
        },

        this.login = async (req, res, next) => {

            if (!req.session.token) return res.json({"login": false})
            try {
                await jwt.verify(req.session.token, conf.auth.secret)
                return res.json({"login": true})
            } catch(err) {
                console.log(err)
                req.session.token = null
                return res.json({"login": false})
            }

        },

        this.logout = (req, res, next) => {

           if (req.session.token) {
               req.session.token = null
               res.json({
                   "login": false
               })
           }

        },

        // ------------------ Sockets

        this.updateUser = (id, credentials) => {

            return new Promise((resolve, reject) => {

                model
                .updateUser(id, credentials)
                .then(newUser => {
                    resolve(newUser)
                })
                .catch(e => {
                    reject(e)
                })

            })

        },

        this.deleteUser = (id) => {
            return new Promise((resolve, reject) => {
                model
                .deleteUser(id, this)
                .then((response) => {
                    resolve(response)
                })
                .catch(e => {
                    reject(e)
                })
            })
        },

        this.deleteUserMessages = (id) => {
            return new Promise((resolve, reject) => {
                model
                .deleteUserMessages(id)
                .then(response => {
                    resolve(response)
                })
                .catch(e => {
                    reject(e)
                })
            })
        }

    }

}

module.exports = new processController()