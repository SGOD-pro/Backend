import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
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
            ref: 'user',
        },
        title: {
            type: String,
            require: true,
        },
        description: {
            type: String,

        },
        duration: {
            type: Number,
            require: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    }, { timestamps: true }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const video = mongoose.model('video', videoSchema)