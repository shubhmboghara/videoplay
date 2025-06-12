import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})



connectDB()


    .then(() => {

        const Server = app.listen(process.env.PORT || 8001, () => {
      console.log(`http://localhost:${process.env.PORT}`);
        })

        Server.on("error", (err) => {
            console.error(" Server startup error:", err);
            process.exit(1)
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
        process.exit(1)

    })