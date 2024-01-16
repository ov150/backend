import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiErrors.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinar} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"
const registerUser = asyncHandler ( async (req, res) =>{
    //get user details from frontend
    //validation - not empty
    //check if user already exists : username, email
    //check for images, for the avatar
    //upload them to cloudinary, avatar
    //create user object - create enrty in db
    //remove password and refresh token field from response
    //check for user creation
    //return response



    const {fullname, email, username, password} = req.body
    console.log("email", email);

    if(
        [fullname, email, username, password].some((field)=>field?.trim()==="")
     ) {
        throw new ApiError(400, "all fields are required")
     }



     const existedUser = User.findOne({
        $or: [{username}, {email}]
     })


     if(existedUser){
        throw new ApiError(409, "User with email and username already existed")
     }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar file is required")
    }

    const avatar = await uploadOnCloudinar(avatarLocalPath)
    const cover = await uploadOnCloudinar(coverLocalPath)

    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase() 
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong...")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )




})



export { 
    registerUser,
 }