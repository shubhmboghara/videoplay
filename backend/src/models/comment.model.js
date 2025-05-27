import mongoose, { model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const commentschema = new Schema({


    content: {
        type: String,
        required: true
    },

    video: {
        type: mongoose.Types.ObjectId,
        ref: "Video"
    },

    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },


}, { timestamps: true })



export const Comment = mongoose.model("Comment", commentschema)