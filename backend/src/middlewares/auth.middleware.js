import { ApiError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"


export const VerifyJwt = asyncHandler(async (req, _, next) => {



    try {
        const token = req.cookies.accessToken || req.header
            ("Authorization")?.replace("Bearer", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invaliad Acces Token")
        }

        req.user = user
        next()
    } catch (error) {

        throw new ApiError(401, error?.message || "Invaliad access token")

    }

})