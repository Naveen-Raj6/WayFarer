import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();


// Configure Cloudinary
cloudinary.config({
    Cloudinary_Cloud_Name: process.env.CLOUDINARY_CLOUD_NAME,
    Cloudinary_Api_Key: process.env.CLOUDINARY_API_KEY,
    Cloudinary_Secret: process.env.CLOUDINARY_API_SECRET,

})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "travel-users",
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [{ width: 500, height: 500, quality: "auto", crop: "scale" }],
    },
    size: 1024 * 1024 * 5
})

let upload = multer({ storage: storage })

export default upload
