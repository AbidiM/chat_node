const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);








// const mongoose = require('mongoose')
// const Joi = require('joi')

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         min: 3,
//         max: 100
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         min: 5,
//         max: 255
//     },
//     password: {
//         type: String,
//         required: true,
//         min: 8,
//         max: 100

//     }
// })

// function validateUser(user) {
//     const schema = Joi.object({
//         name: Joi.string().min(3).max(100).required(),
//         email: Joi.string().min(5).max(255).required().email(),
//         password: Joi.string().min(8).max(100).required()
//     })
//     return schema.validate(user)
// }
// const User = mongoose.model('User', userSchema)
// module.exports.validate = validateUser
// module.exports.User = User