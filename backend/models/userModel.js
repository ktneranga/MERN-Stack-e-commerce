import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

//create the schema
const userSchema = mongoose.Schema({
    //we define all the fields for the user
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    //we need this when only the password has changed 
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//create the model
const User = mongoose.model('User', userSchema);

export default User;