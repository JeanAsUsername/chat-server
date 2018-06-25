
const firebase = require('firebase-admin'),
    key = require('./local-chat-92646-firebase-adminsdk-x39ad-929555645e.json')

firebase.initializeApp({
    credential: firebase.credential.cert(key),
    databaseURL: 'https://local-chat-92646.firebaseio.com/'
})

module.exports = firebase.database()