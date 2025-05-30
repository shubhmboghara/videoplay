import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyJwt } from "../middlewares/auth.middleware.js"
import { getAllVideos, publishAVideo,updateVideo,deleteVideo,togglePublishStatus,getVideoById} from "../controllers/video.controller.js";



const router = Router() 

router
    .route("/")
    .get(getAllVideos)
    .post(
        VerifyJwt,
        upload.fields([
            {
                name: "video",
                maxCount: 1
            },

            {
                name: "thumbnail",
                maxCount: 1
            }
        ]),
        publishAVideo
    )

router
  .route("/:videoId") 
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

    router.route("/toggle/publish/:videoId").patch(VerifyJwt,togglePublishStatus);

export default router

