import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_VIDEO,
    api_key: process.env.CLOUDINARY_API_KEY_VIDEO,
    api_secret: process.env.CLOUDINARY_API_SECRET_VIDEO
});



const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null

        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        fs.unlinkSync(localFilePath)
        return res
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

function publicId(url) {
    if (!url) return null;
    url = url.split('?')[0];
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return matches ? matches[1] : null;
}

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    return result;
  } catch (err) {
    console.error("Cloudinary deletion error:", err);
    throw new Error("Deletion failed");
  }
};

export default { uploadOnCloudinary, deleteFromCloudinary, publicId }
