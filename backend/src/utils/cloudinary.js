import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY,
    api_key: process.env.CLOUDINARY_API_KET,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null

        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log("file is uploaded on cloudinary", res.url);

        return res
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}
