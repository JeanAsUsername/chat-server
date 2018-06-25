
module.exports = (instance) => {

    const io = instance.of('/profile'),
        processController = require('../../controllers/process-controller')

    io.on('connection', (socket) => {

        let room = undefined

        socket.on('joinRoom', (commingRoom) => { 
            socket.join(commingRoom)
            room = commingRoom
        })

        socket.on('updateUser', (id, credentials) => {
           processController
           .updateUser(id, credentials)
           .then((commingUser) => {
            
                const newUser = {
                    id: commingUser._id,
                    username: commingUser.username,
                    email: commingUser.email,
                    color: commingUser.color
                }

                io.in(room).emit('userUpdated', newUser)

           })
           .catch(e => {
               console.log(err)
           })
        })

        socket.on('deleteUser', (id) => {
            processController
            .deleteUser(id)
            .then(response => {
                console.log(response)
                io.in(room).emit('userDeleted')
            })
            .catch(e => {
                console.log(e)
            })
        })


    })


} 