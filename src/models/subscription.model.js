import mongoose, { Schema } from "mongoose";

const subscriptionSchema = Schema({
    channel: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
},
    {
        timestamps: true
    }
)

export const Subscription = mongoose.model("subscription", subscriptionSchema)