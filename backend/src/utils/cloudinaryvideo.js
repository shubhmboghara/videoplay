import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_VIDEO,
  api_key: process.env.CLOUDINARY_API_KEY_VIDEO,
  api_secret: process.env.CLOUDINARY_API_SECRET_VIDEO
});



const uploadOnCloudinary = async (localFilePath,resourceType = "image") => {

  try {
    if (!localFilePath) return null

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    })

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath)
    }
    return res
  } catch (error) {
    fs.unlinkSync(localFilePath)
    return null
  }
}

const publicId = (url) => {
  try {
    const parts = url.split('/');
    const fileWithExtension = parts[parts.length - 1];
    const [fileId] = fileWithExtension.split('.');
    return fileId; 
  } catch (error) {
    return null;
  }
};


const deleteFromCloudinary = async (publicId, type = "image") => {
  try {
  return await cloudinary.uploader.destroy(publicId, { resource_type: type });
  } catch (err) {
    console.error("Cloudinary deletion error:", err);
    throw new Error("Deletion failed");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, publicId }