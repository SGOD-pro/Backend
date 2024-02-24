import asyncHandeler from "../utils/asyncHandeler.js";
import { apiErrors } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { cloudinaryUpload } from "../utils/Cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";
const registerUser = asyncHandeler(async (req, res) => {
    // res.status(269).json({
    //     message:'All set'
    // })

    const { fullname, username, email, password } = req.body
    console.log(req.body);
    [fullname, username, email, password].forEach(element => {
        if (element === '' || !element) {
            throw new apiErrors(400, `Something is empty..`)
        }
    });

    const exitsusre = await User.findOne({
        $or: [{ username, email }]
    })
    if (exitsusre) {
        throw new apiErrors(409, `User already exists.`)
    }


    //Upload files functionality
    const avatarPath = req.files?.avatar[0]?.path
    let coverImagePath;

    if (Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImagePath = req.files.coverImage[0].path
    }
    if (!avatarPath) {
        throw new apiErrors(400, 'AvatarPath is required')
    }
    const avatar = await cloudinaryUpload(avatarPath)
    const coverImage = await cloudinaryUpload(coverImagePath)
    console.log(avatar);
    if (!avatar) {
        throw new apiErrors(400, 'Avatar is required')
    }

    const createdUser = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ''
    })

    const user = await User.findById(createdUser._id).select("-password -refreshToken")
    if (!user) {
        throw new apiErrors(500, "Some internal error occurs")
    }
    res.status(201).json(new apiResponce(201, user, 'User Registered Successfully'));
})

export { registerUser }