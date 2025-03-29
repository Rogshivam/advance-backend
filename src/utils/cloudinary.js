import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

   // Configuration
cloudinary.config({ 
    cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME',
    api_key: 'process.env.CLOUDINARY_API_KEY',
    api_secret: 'process.env.CLOUDINARY_API_SECRET'
});
const uploadOnCloudinary = async (loaclFilePath) => {
    try{
        if(!loaclFilePath) return null;
        const response = await cloudinary.uploader.upload(loaclFilePath, {
            resource_type: 'auto'
        })
        //file has been uploaded successfully
        console.log("File uploaded on cloudinary", response.url);
        retrun.url;
        return response;
    } catch (error) {
        fs.unlinkSync(loaclFilePath); // delete the file from local storage
        return null;
    }

    
}

export {uploadOnCloudinary}