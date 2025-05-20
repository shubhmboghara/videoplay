import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/AppError.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { lookup } from "dns"
import { subscribe } from "diagnostics_channel"
import mongoose, { mongo } from "mongoose"
import { pipeline } from "stream"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log("User not found for ID:", userId)
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        console.error("Token generation error:", error)
        throw new ApiError(500, "somthing went wornog while generate Access And Refresh Tokens")
    }
}


const registerUser = asyncHandler(async (req, res) => {

    const { fullname, email, username, password } = req.body



    if ([fullname, email, username, password].some((field) =>
        field?.trim() === "")) {
        throw new ApiError(400, "All  fields are required ")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User  with email or username  already exists ")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path


    const coverImageLocalPath = req.files?.coverImage[0]?.path
    console.log(coverImageLocalPath)

    //    if(!avatarLocalPath){
    //      throw new ApiError(400,"Avatar file is  required")
    //    }


    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    const user = await User.create({
        fullname,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        password,
        username: username.toLowerCase(),
        email
    })


    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createduser) {
        throw new ApiError(500, "Somthing went wrong  while  registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createduser, "User registering successfully")
    )
})



const loginUser = asyncHandler(async (req, res) => {

    //  1. Get information (username or email, and password) from the user.
    //  2. Verify that the user is registered and the credentials are correct.
    //  3. Generate and return an access token and a refresh token.
    //  4. send cokie
    //  5.If everything is valid, grant login permission.   (function: generateAccessAndRefreshTokens).



    const { emailorusername, password } = req.body

    const user = await User.findOne({
        $or: [
            { email: emailorusername },
            { username: emailorusername }
        ]
    })



    if (!user) {
        throw new ApiError(400, "User does not exist")
    }
    const ispasswordValid = await user.isPasswordCorrect(password)

    if (!ispasswordValid) {
        throw new ApiError(401, "Invalid user credentials")

    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:
            {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out "))

})

const refreshAccesToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodeToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )

        const user = await User.findById(decodeToken?._id)

        if (!user) {
            throw new ApiError(401, " In requvalid refresh token")
        }


        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or  used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { newaccessToken, newrefreshToken } = await generateAccessAndRefreshTokens(user._id)
            .status(200)
            .cookie("newaccessToken", newaccessToken, options)
            .cookie("newrefreshToken", newrefreshToken, options)
            .json({
                message: "Access token refreshed",
            })

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token ");

    }

})

const changePassword = asyncHandler(async (req, res) => {


    // First, compare the current password to check if it is correct If it is, then write the new password and change the old password to the new one


    const user = User.findById(req.user?._id)
    const { oldPassword, newPassword } = req.body
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "invalid old password")
    }

    user.password = newPassword
    await user.sav({ validateBeforeSave: false })



    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(200, req.user, "currect user fetched successfully")

})

const updateAccountDetai1s = asyncHandler(async (req, res) => {

    const { fullname, email } = req.body

    if (!fullname || email) {
        throw new ApiError(400, "All fields are requuired")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }

    ).select("-password")

    returnres
        .status(200)
        .json(new ApiResponse(200, user, "Account detalis updated successfully"))


})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const USER = await User.findById(req.user?._id)

    if (USER?.avatar) {
        const publicId = getCloudinaryPublicId(USER.avatar)
        if (publicId) {
            await deleteFromCloudinary(publicId);
        }
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Eroor while uploading on avatar ");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,

        {
            $set: {
                avatar: avatar.url
            }

        },

        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "avatar image is updated successfully")
        )

})

const updatecoverImage = asyncHandler(async (req, res) => {


    const coverimageLocalPath = req.file?.path


    if (!coverimageLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const USER = await User.findById(req.user?._id)

    if (USER?.coverImage) {
        const publicId = getCloudinaryPublicId(USER.coverImage)

        if (publicId) {
            await deleteFromCloudinary(publicId);
        }
    }



    const coverImage = await uploadOnCloudinary(coverimageLocalPath)

    if (!coverImage) {
        throw new ApiError(400, "Eroor while uploading on coverimage ");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,

        {
            $set: {
                coverImage: coverImage.url
            }

        },

        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover image is updated successfully")
        )
})


const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { username } = req.params

    if (!username?.trim()) {

        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([

        {
            $match: {
                username: username.toLowerCase()
            }
        },

        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },

        {
            $lookup: {
                from: "channel",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },

        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },

                channelsSubscribedToCount: {
                    $size: "$subscribedTo"

                },

                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },

        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1

            }
        }
    ])

    console.log(channel)


    if (!channel?.length) {
        throw new ApiError(400, "channel does not exists")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "User  channel fetched succesfully")
        )
})

const watchHistory = asyncHandler(async (req, res) => {

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req, user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ])
})

export {
    loginUser,
    registerUser,
    logoutUser,
    refreshAccesToken,
    changePassword,
    getCurrentUser,
    updateAccountDetai1s,
    updateAvatar,
    updatecoverImage,
    getUserChannelProfile

}
