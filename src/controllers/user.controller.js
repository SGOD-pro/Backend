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

    [fullname, username, email, password].forEach(element => {
        if (element === '' || element) {
            throw new apiErrors(400, `${element} is empty..`)
        }
    });

    const exitsusre = User.findOne({
        $or: [{ username, email }]
    })
    if (exitsusre) {
        throw new apiErrors(409, `User already exists.`)
    }


    //Upload files functionality
    const avatarPath = req.files?.avatar[0]?.path
    const coverImagePath = req.files?.coverImage[0]?.path
    if (!avatarPath) {
        throw apiErrors(400, 'Avatar is required')
    }
    const avatar = await cloudinaryUpload(avatarPath)
    const coverImage = await cloudinaryUpload(coverImagePath)
    if (!avatar) {
        throw apiErrors(400, 'Avatar is required')
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
        apiErrors(500, "Some internal error occurs")
    }
    res.send(200).json(
        new apiResponce(201, user, 'User Registered Successfully')
    )
})

export { registerUser }