import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))


app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({extended:true, limit:"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())

export { app }