const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 50,
        required: true,
    },
    number: {
        type: String,
        minLength: 10,
        required: true,
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
