import {v2 as cloudinary} from 'cloudinary';
import { response } from 'express';
import fs from "fs"   
 
cloudinary.config({ 
  cloud_name: process.env.CLOUDINRY_NAME, 
  api_key: process.env.CLOUDINRY_API_KEY, 
  api_secret: process.env.CLOUDINRY_API_SECRET 
});

const uploadOnCloudinar = async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        const responce = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file uploaded", response.url);
        return response;
        
    }catch(error){
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export {uploadOnCloudinar} 