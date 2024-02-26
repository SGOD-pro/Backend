import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true, //imporve query operations
        unique: true,
        lowercase: true,
        trim: true, //removes starting and ending extra white spaces 
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    avatar: {
        type: String,
        requiredd: true
    },
    coverImage: {
        type: String,
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'video'
    }],
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String
    },
    
},
    { timestamps: true } //For this we automaticaly get 2 extra fields createAt,updatedAt....
)


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); //checking if the password is modified or not, then perform encryption operation

    this.password = await bcrypt.hash(this.password, 10);
    next()
})//pre is a hook, save is a event-> run this hook before saving data, we always use functions not arrow functions because in arrow function there is no reference(this) thats why we use normal function


userSchema.methods.isPasswordCorrect = async function (password) { //adding custom methods 
    return bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id:this. _id, email: this.email, username: this.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXP }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id:this._id },
        process.env.REFRESH_TOKEN,
        { expiresIn: process.env.REFRESH_TOKEN_EXP }
    )
}
export const User = mongoose.model('user', userSchema)