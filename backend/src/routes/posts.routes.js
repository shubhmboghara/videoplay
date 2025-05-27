import { Router } from "express";
import {
    createPosts,
    getUserPosts,
    updatePosts,
    deletePosts
} from "../controllers/posts.controller.js"
import { VerifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(VerifyJwt); 

router.route("/").post(createPosts);
router.route("/user/:userId").get(getUserPosts);
router.route("/:id").patch(updatePosts).delete(deletePosts);    

export default router