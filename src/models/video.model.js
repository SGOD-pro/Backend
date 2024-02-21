import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    videoFile: {
        type: String,
        require: true,
    },
    thumbnail: {
        type: String,
        require: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    title: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    description: {
        type: Schema.Types.ObjectId,
        
    },
}, { timestamps: true }
)

export const video = mongoose.model('video', videoSchema)