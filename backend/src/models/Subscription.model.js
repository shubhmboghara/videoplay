import mongoose, { Schema } from "mongoose";

const subscriptionschema = new Schema({


    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    // The channel field stores the user (channel) that I have subscribed to, count documents where channel  i subscribed

    channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

    // Total subscribers I have  for example if my channel is shubham"
    // I will count all documents where channel is set to shubham

}, { timestamps: true })




export const Subscription = mongoose.model("Subscription", subscriptionschema)