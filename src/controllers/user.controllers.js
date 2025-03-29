import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    // Validation -not empty
    //check if user already exists
    //check for images, check for avatar
    //upload them to cloudinary
    //create user in object - create entry in db
    //remove password and refresh token fiel from response
    //check for user creation
    //return res

    const { fullName, email, username, password} = req.body
    // console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "Please fill all the fields")
    }
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path ;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath ){
        throw new ApiError(400, "Please upload avatar and cover image")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImages = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar ){
        throw new ApiError(400, "Image upload failed")
    };
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImages: coverImages?.url || "",
        email,
        password,
        username: username.toLowerCase(),
        
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully"),
    )
})

export { registerUser, }