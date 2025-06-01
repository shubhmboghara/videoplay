import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    posts: { 
        type: Schema.Types.ObjectId,
        ref: "Posts"
    },
    posts: {
        type: Schema.Types.ObjectId,
        ref: "Posts"
    },
    comment: { 
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

likeSchema.index({ video: 1, likedBy: 1 }, { unique: true, partialFilterExpression: { video: { $exists: true } } });
likeSchema.index({ comment: 1, likedBy: 1 }, { unique: true, partialFilterExpression: { comment: { $exists: true } } });
likeSchema.index({ posts: 1, likedBy: 1 }, { unique: true, partialFilterExpression: { posts: { $exists: true } } });




export const Like = mongoose.model("Like", likeSchema);