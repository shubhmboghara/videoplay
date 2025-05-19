import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/AppError.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

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

    if (incomingRefreshToken) {
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
            });
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token ");

    }

})

export { loginUser, registerUser, logoutUser,refreshAccesToken }
