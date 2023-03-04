import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    username: {
        required: [true, 'Please enter a unique username'],
        unique: true,
        type: String
    },
    password: {
        required: [true, 'Please enter a password'],
        unique: false,
        type: String
    },
    email: {
        required: [true, 'Please enter a valid Email!'],
        unique: true,
        type: String
    },
    firstName: { type: String },
    lastName: { type: String},
    mobile: { type: Number },
    address: { type: String },
    profile: { type: String },

})

const Users = mongoose.model('User', UserSchema)

export default  Users;