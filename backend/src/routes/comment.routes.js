import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import { VerifyJwt } from '../middlewares/auth.middleware.js';
const router = Router();

router.use(VerifyJwt);

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentid").delete(deleteComment).patch(updateComment);

export default router