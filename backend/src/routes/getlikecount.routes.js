import { getVideoLikeCount } from '../controllers/like.controller.js';
import { Router } from 'express';
const router = Router();


router.get("/:videoId", getVideoLikeCount);

export default router