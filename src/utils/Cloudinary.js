import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


const cloudinaryUpload = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });


    try {
        const result = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
        filePath && fs.unlinkSync(filePath)
        return result
    } catch (error) {
        console.error(error);
        filePath && fs.unlinkSync(filePath)
    }
}



export { cloudinaryUpload }