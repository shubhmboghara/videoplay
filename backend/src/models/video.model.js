import mongoose, { Schema, Types } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const VideoSchema = new Schema(

    {
        VideoFile: {
            types: String,
            required: true
        },

        thumbnail: {
            types: String,
            required: true
        },

        title: {
            types: String,
            required: true
        },

        description: {
            types: String,
            required: true
        },

        duration: {
            types: String,
            required: true
        },

        views: {
            type: String,
            default: 0
        },

        isPublished:{
            type:Boolean,
            default: true            
        },

        owner:{
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    },

    { timestamps: true }
)

  VideoSchema.plugin(mongooseAggregatePaginate)
  

export const Video = mongoose.model("Video", VideoSchema)