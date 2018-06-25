'use strict'

const mongoose = require('mongoose'),
      commonPattern = {
          type: String,
          required: true
      },
      messageSchema = mongoose.Schema({
          userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'user',
              required: true
          },
          content: commonPattern,
          createdAt: {
              type: Date,
              default: Date.now
          }
      })

module.exports = messageSchema