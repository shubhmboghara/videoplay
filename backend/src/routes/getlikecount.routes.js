import { getVideoLikeCount, getPostsLikeCount, getCommentLikeCount } from '../controllers/like.controller.js';
import { Router } from 'express';
const router = Router();


router.get("/:videoId", getVideoLikeCount);
router.get("/:commentId", getCommentLikeCount)
router.get("/:postsId", getPostsLikeCount)



export default router