'use strict'

module.exports = {

    getMessages(model) {
        return new Promise((resolve, reject) => {

            model
            .find({})
            .populate('userId', 'username color')
            .sort({createdAt: -1})
            .limit(50)
            .exec((err, messages) => {
                if (err) return reject(new Error('No se han podido obtener los mensajes'))
                return resolve(messages.reverse())
            })


        })
    },

    addMessage(model, data) {
        return new Promise((resolve, reject) => {
            
            const message = new model(data)

            message.save((err) => {
                if (err) return reject(new Error('Unable to create that message'))
                return resolve(message)
            })

        })
    },

    deleteUserMessages(model, id) {
        return new Promise((resolve, reject) => {
            model
            .deleteMany({"userId": id}, (err) => {
                if (err) return reject(new Error('Unable to delete those messages'))
                resolve('messages deleted !')
            })
        })
    }
    
}