import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from 'fs'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const cloudinaryUpload = async (filePath) => {

    try {
        const result = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
        filePath && fs.unlinkSync(filePath)
        return result
    } catch (error) {
        console.error(error);
        filePath && fs.unlinkSync(filePath)
    }
}

const cloudinaryDelete = async (pathLink) => {
    try {
        const regex = /\/([^\/]+)\.jpg$/;
        const match = pathLink.match(regex);
        const id = match[1];
        const response = await cloudinary.v2.api.delete_resources(
            [id],
            { type: 'upload', resource_type: 'image' }
        )
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export { cloudinaryUpload,cloudinaryDelete }