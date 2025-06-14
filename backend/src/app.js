import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import postRouter from "./routes/posts.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import getlikecount from "./routes/getlikecount.routes.js"
import subscribercount from "./routes/subscribercount.routes.js"
const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }))


app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(express.static("public"))
app.use(cookieParser())


app.use("/api/v1/users", userRouter)
app.use('/api/v1/video', videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use('/api/v1/likes/count' ,getlikecount)
app.use('/api/v1/subscriber/subscribercount' ,subscribercount)





export { app }
