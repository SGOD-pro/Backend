import mongoose, { Schema } from "mongoose";

const subscriptionSchema = Schema({
    channelSubdcribers: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    subscriptions: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
},
    {
        timestamps: true
    }
)

export const Subscription = mongoose.model("subscription", subscriptionSchema)