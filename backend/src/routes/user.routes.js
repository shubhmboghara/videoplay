import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { VerifyJwt } from "../middlewares/auth.middleware.js"
import {
    refreshAccesToken,
    changePassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updatecoverImage,
    getUserChannelProfile,
    watchHistory,
    registerUser,
    loginUser,
    logoutUser
} from "../controllers/user.controllers.js";




const router = Router()

router.route("/signup").post(
    upload.fields([

        {
            name: "avatar",
            maxCount: 1
        },

        {
            name: "coverImage",
            maxCount: 1
        }
    ]),

    registerUser)

router.post('/login', loginUser)
router.route("/logout").post(VerifyJwt, logoutUser)
router.route("/refresh-token").post(refreshAccesToken)
router.route("/change-password").patch(VerifyJwt, changePassword)
router.route("/current-user").get(VerifyJwt, getCurrentUser)
router.route("/c/:username").get(VerifyJwt, getUserChannelProfile)
router.route("/history").get(VerifyJwt, watchHistory)


router.route("/update-account-detai1s").patch(VerifyJwt, updateAccountDetails)
router.route("/update-avatar").patch(VerifyJwt, upload.single("avatar"), updateAvatar)
router.route("/updatecover-image").patch(VerifyJwt,upload.single("coverImage"), updatecoverImage)







export default router