import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinaryvideo.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "title and description are required");
    }

    const videoFilePath = req.files?.video?.[0]?.path
    const thumbnailFilePath = req.files?.thumbnail?.[0]?.path

  
    if (!videoFilePath || !thumbnailFilePath) {
        throw new ApiError(400,"video and thumbnail are required ")
    }

    const video = await uploadOnCloudinary(videoFilePath)
    const thumbnail = await uploadOnCloudinary(thumbnailFilePath)

    if (!video?.url || !thumbnail?.url) {
        throw new ApiError(500,"video or thumbnail upload failed ")
    }

    const duration = video.duration

    const newVideo =  await Video.create({
         title,
         description,
         owner: req.user._id,
         videoFile:video.url,
         thumbnail:thumbnail.url,
         duration:duration
         
    })
    return res.status(201).json(
        new ApiResponse(201, newVideo, "Video uploaded successfully")
    )

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