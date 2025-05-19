import { Router } from "express"
import { registerUser, loginUser, logoutUser } from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middleware.js"
import { VerifyJwt } from "../middlewares/auth.middleware.js"
import { refreshAccesToken } from "../controllers/user.controllers.js"


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



export default router