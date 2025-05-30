import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/AppError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary, publicId } from "../utils/cloudinaryvideo.js"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

const timeAgo = (date) => dayjs(date).fromNow();

const getAllVideos = asyncHandler(async (req, res) => {
    const {
        query,
        sortBy = ["views", "createdAt"],
        sortType = "desc",
        userId,
        page = 1,
        limit = 10,
    } = req.query;

    const skip = (page - 1) * limit;

    const matchStage = { isPublished: true };
    const sortDir = sortType === "asc" ? 1 : -1;

    if (query?.trim()) {
        matchStage.$text = { $search: query.trim() };
    }

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    const sortStage = {};
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
                as: "owner",
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
                VideoFile: 1,
                createdAt: 1,
                "owner.username": 1,
                "owner.avatar": 1,
            },
        },
        { $sort: sortStage },
        { $skip: skip },
        { $limit: parseInt(limit, 10) },
    ];

    const videos = await Video.aggregate(pipeline);

    const videosWithTimeAgo = videos.map((video) => ({
        ...video,
        timeAgo: timeAgo(video.createdAt),
    }));

    return res.status(200).json(
        new ApiResponse(200, { videos: videosWithTimeAgo }, "All videos fetched successfully")
    );
});


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
    const userId = req.user?._id


    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(404, "Invalid video ID");
    }

    await Promise.all([
        Video.updateOne({ _id: videoId }, { $inc: { views: 1 } }),
        (async () => {
            if (userId) {
                const user = await User.findById(userId);
                if (user) {
                    user.watchHistory = user.watchHistory.filter(id => id.toString() !== videoId);
                    user.watchHistory.unshift(videoId);
                    if (user.watchHistory.length > 50) user.watchHistory.pop();
                    await user.save();
                }
            }
        })(),
    ]);

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (req.user && req.user._id) {
        const user = await User.findById(req.user._id);

        if (user) {
            user.watchHistory = user.watchHistory.filter(
                (id) => id.toString() !== videoId
            );
            user.watchHistory.unshift(videoId);

            if (user.watchHistory.length > 40) {
                user.watchHistory = user.watchHistory.slice(0, 50);
            }

            await user.save();
        }
    }

    await Video.updateOne({ _id: videoId }, { $inc: { views: 1 } });

    const pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            foreignField: "channel",
                            localField: "_id",
                            as: "subscribers",
                        },
                    },
                    {
                        $addFields: {
                            subscribers: "$subscribers.subscriber",
                        },
                    },
                    {
                        $addFields: {
                            subscriberCount: {
                                $size: "$subscribers",
                            },
                            isSubscribed: req.user
                                ? {
                                    $cond: {
                                        if: { $in: [req.user._id, "$subscribers"] },
                                        then: true,
                                        else: false,
                                    },
                                }
                                : false,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                            createdAt: 1,
                            subscriberCount: 1,
                            isSubscribed: 1,
                        },
                    },
                ],
            },
        },
        { $unwind: "$owner" },
        {
            $project: {
                title: 1,
                description: 1,
                VideoFile: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                owner: 1,

            },
        },
    ];

    const result = await Video.aggregate(pipeline);

    if (!result || result.length === 0) {
        throw new ApiError(404, "Video not found");
    }

    let watchHistoryIds = [];
    if (userId) {
        const user = await User.findById(userId).select("watchHistory");
        watchHistoryIds = user?.watchHistory.map(id => id.toString()) || [];
    }

    const videoData = {
        ...result[0],
        timeAgo: timeAgo(result[0].createdAt),
    };

    res.status(200).json(new ApiResponse(200, 
        {videoData, watchHistory: watchHistoryIds},
         "Video found successfully"));
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const title = req.body?.title
    const description = req.body?.description
    const thumbnailLocalPath = req.file?.path;


    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!title && !description && !thumbnailLocalPath) {
        throw new ApiError(400, "At least one field (title, description, or thumbnail) is required for update");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    let uploadedThumbnail;

    if (thumbnailLocalPath && video.thumbnail) {
        const id = publicId(video.thumbnail)

        if (id) {
            await deleteFromCloudinary(id)
        }

        uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if (!uploadedThumbnail) {
            throw new ApiError(500, "Error uploading new thumbnail")
        }
    }

    const updatedFields = {}
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (uploadedThumbnail) updatedFields.thumbnail = uploadedThumbnail.secure_url;

    const response = await Video.findByIdAndUpdate(
        videoId,
        { $set: updatedFields },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, response, "Video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    await deleteFromCloudinary(publicId(video.thumbnail), "image");
    await deleteFromCloudinary(publicId(video.VideoFile), "video");



    await Video.findByIdAndDelete(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found");
    }


    return res
        .status(200)
        .json(
            new ApiResponse(200,
                "video is deleted successfully"
            )
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video not found")
    }

    video.isPublished = !video.isPublished;
    await video.save()

    res.status(200)
        .json(
            new ApiResponse(200, `Video is now ${video.isPublished ? "Published" : "Unpublished"}`,
                { isPublished: video.isPublished, }
            )
        )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}