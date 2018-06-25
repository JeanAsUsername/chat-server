'use strict'

const mongoose = require('mongoose'),
      commonPattern = {
          type: String,
          required: true
      },
      userSchema = mongoose.Schema({
          username: commonPattern,
          email: commonPattern,
          password: commonPattern,
          range: {
              ...commonPattern,
              default: 'user'
          },
          color: {
              ...commonPattern,
              default: '#5980a6'
          },
          createdAt: {
              type: Date,
              default: Date.now
            
          }
      })

module.exports = userSchema