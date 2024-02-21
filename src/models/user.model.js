import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    usename: {
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
    avater: {
        type: String,
        requiredd: true
    },
    coverimage: {
        type: String,
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: 'video'
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String
    },
    refreshToken: {
        type: String
    }
},
    { timestamps: true } //For this we automaticaly get 2 extra fields createAt,updatedAt....

)

export const user = mongoose.model('user', userSchema)