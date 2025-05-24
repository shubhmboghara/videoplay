import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/AppError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinaryvideo.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { query, sortBy = ["views", "createdAt"], sortType = "desc", userId } = req.query

    const matchStage = { isPublished: true };
    const sortDir = sortType === "asc" ? 1 : -1;

    if (query?.trim()) {
        matchStage.$text = { $search: query.trim() }
    }

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    const sortStage = {}
    if (Array.isArray(sortBy)) {
        for (const field of sortBy) {
            sortStage[field] = sortDir;
        }
    } else {
        sortStage[sortBy] = sortDir;
    }




        const pipeline = [
            { $match: matchStage },

            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                },
            },
            { $unwind: "$owner" },

            {
                $project: {
                    thumbnail: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    duration: 1,
                    "owner.username": 1,
                    "owner.avatar": 1
                }
            },
            { $sort: sortStage }

        ]
       const videos = await Video.aggregate(pipeline)

    return res.status(200).json(
        new ApiResponse(200,

            {
                videos
            },

            "All videos fetched successfully"
        )
    )



})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "title and description are required");
    }

    const videoFilePath = req.files?.video?.[0]?.path
    const thumbnailFilePath = req.files?.thumbnail?.[0]?.path


    if (!videoFilePath || !thumbnailFilePath) {
        throw new ApiError(400, "video and thumbnail are required ")
    }

    try {
        const video = await uploadOnCloudinary(videoFilePath, "video")
        const thumbnail = await uploadOnCloudinary(thumbnailFilePath)

        if (!video?.url || !thumbnail?.url) {
            throw new ApiError(500, "video or thumbnail upload failed ")
        }

        const duration = video?.duration ? Math.round(video.duration) : 0

        const newVideo = await Video.create({
            title,
            description,
            owner: req.user._id,
            VideoFile: video.url,
            thumbnail: thumbnail.secure_url,
            duration: duration,
            isPublished: true

        })
        return res.status(201).json(
            new ApiResponse(201, newVideo, "Video uploaded successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");

    }

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}