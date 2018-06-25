
const firebaseDB = require('../../services/firebase'),
    // controller
    normalController = require('../../controllers/normal-controller')

module.exports = (instance) => {

    const io = instance.of('chat')

    io.on('connection', (socket) => {

        // set chat room
        let room = undefined;

        socket.on('joinChat', (commingRoom) => {
            socket.join(commingRoom)
            room = commingRoom
        })

        // new message
        socket.on('message', (data, username, color) => {

            normalController
            .addMessage(data)
            .then(message => {
                io.in(room).emit('message', {
                    id: message._id,
                    username: username,
                    color: color,
                    content: message.content
                })
            })
        })

        // disconnect
        socket.on('disconnect', () => {
            firebaseDB.ref('users/').remove()
            socket.broadcast.emit('updateUser')
        })

    })
    
}