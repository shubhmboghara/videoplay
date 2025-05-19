import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js";

const app = express()


 app.use(
    cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))


app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({extended:true, limit:"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(
    cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))
 
app.use("/api/v1/users", userRouter)


export { app }