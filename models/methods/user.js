'use strict'

module.exports = {

    createUser(model, credentials) {
        return new Promise((resolve, reject) => {
            const user = new model(credentials)
            
            user.save((err) => {
                if (err) return reject(new Error('Unable to create that user'))
                return resolve(user)
            })

        })
    },

    searchUser(model, email) {
        return new Promise((resolve, reject) => {
            model
                .findOne({email}, (err, user) => {
                    if (err) return reject(new Error('Unable to find that user'))
                    return resolve(user)
                })
        })
    },

    updateUser(model, id, credentials) {
        return new Promise((resolve, reject) => {
            model
                .findOne({"_id": id}, (err, user) => {
                    if (err) return reject(new Error('Unable to find that user'))

                    user.set(credentials)
                    
                    user.save((err) => {
                        if (err) return reject(new Error('Unable to update that user'))
                        resolve(user)
                    })
                })
        })
    },

    deleteUser(model, id, controller) {
        // here we first delete the user from the database and next delete his messages too
        return new Promise((resolve, reject) => {
            // delete user
            model.deleteOne({"_id": id}, (err) => {
                if (err) return reject(new Error('Unable to delete that user'))
                // delete messages
                controller
                .deleteUserMessages(id)
                .then(response => {
                    console.log(response)
                    resolve('User deleted !!')
                })
            })
        })

    }

}