import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/AppError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { videoId } = req.params
    const skip = (page - 1) * limit;


    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const comments = await Comment.find({ video: videoId })
        .populate("owner", "username  avatar")
        .sort({ createdAt: - 1 })
        .skip(skip)
        .limit(limit)


    const totalComments = await Comment.countDocuments({ video: videoId });
    return res
        .status(200)
        .json(
            new ApiResponse(200,
                {
                    totalComments,
                    page,
                    limit,
                    comments
                },
                "All comments fetched")
        )

})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body



    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video not found ")
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content are required")
    }

    const comment = await Comment.create({
        content,
        owner: req.user._id,
        video: videoId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, comment, "Comment added")
        )
})

const updateComment = asyncHandler(async (req, res) => {

    const { commentid } = req.params
    const { content } = req.body

    if (!mongoose.Types.ObjectId.isValid(commentid)) {
        throw new ApiError(400, "Invalid comment id ")
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content are required")
    }
    
    const comment = await Comment.findById(commentid)

    if (!comment) {
        throw new ApiError(404, " comment not found ")
    }


    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to edit this comment");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentid, {
        $set: {
            content: content
        },
    },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedComment, "Comment updated")
        )

})

const deleteComment = asyncHandler(async (req, res) => {

    const { commentid } = req.params;
    console.log("Comment ID Params:", req.params);

    if (!mongoose.Types.ObjectId.isValid(commentid)) {
        throw new ApiError(400, "Invalid comment id ")
    }

    const comment = await Comment.findById(commentid)

    if (!comment) {
        throw new ApiError(404, " comment not found ")
    }


    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this comment");
    }

    await comment.deleteOne()

    return res
        .status(200)
        .json(
            new ApiResponse(200, "comment deleted ")
        )


})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}