import asyncHandeler from "../utils/asyncHandeler.js";
import { apiErrors } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { cloudinaryDelete, cloudinaryUpload } from "../utils/Cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validationBeforeSave: false })
        return { accToken, refreshToken }
    } catch (error) {
        throw new apiErrors(500, "Some internal error occurs when generation access tokens.")
    }
}

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
    console.log(req.files);
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

const userLogin = asyncHandeler(async (req, res) => {
    const { username, email, password } = req.body
    console.log(req.body);
    [username, email, password].forEach(elem => {
        if (elem === '' || !elem) {
            throw new apiErrors(400, "Some field is missing")
        }
    })

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new apiErrors(404, "User not found.")
    }
    const isPasswordValid = user.isPasswordCorrect(password)
    if (!isPasswordValid) throw new apiErrors(401, "Incorrect password.")
    console.log(user._id);
    const { accToken, refreshToken } = await generateTokens(user._id)
    const userData = await User.findById(user._id).select("-password -refreshToken")
    if (!userData) {
        throw new apiErrors(500, "Some internal error occurs")
    }
    const options = {
        httpOnly: true,
        secure: true,
    }

    res
        .status(200)
        .cookie("accessToken", accToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponce(200, { user: userData, accToken, refreshToken }, 'User Login Successfully'));
})


const logout = asyncHandeler(async (req, res) => {
    const user = req.user

    await User.findByIdAndUpdate(user._id,
        {
            // $set: { refreshToken: undefined }  //NOTE:It over write the field 
            $unset: { refreshToken: 1 }  //it removes the field from document
        },
        {
            new: true  //NOTE:return back the new document after modified the fields
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200).clearCookie("accessToken", options).cookie("refreshToken", options).json(new apiResponce(200, {}, "User successfully logout."))
})


const regenerateToken = asyncHandeler(async (req, res) => {
    const token = req.cookie?.refreshToken || req.body?.refreshToken
    if (!token) {
        throw new apiErrors(401, "Tokens doesn't find")
    }
    try {
        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new apiErrors(400, "Invalid refresh token.")

        }
        if (user?.refreshToken !== token) {
            throw new apiErrors(400, "Refresh tokens doesn't match")
        }

        const { accToken, refreshToken } = await generateTokens(user._id)
        const options = {
            httpOnly: true,
            secure: true,
        }

        res
            .status(200)
            .cookie("accessToken", accToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new apiResponce(200, { accToken, refreshToken }, 'User Login Successfully'));
    } catch (error) {
        throw new apiErrors(400, error.message || "Invalid refresh token")

    }
})

const changePassword = asyncHandeler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    if (!await user.isPasswordCorrect(oldPassword)) {
        throw new apiErrors(400, "Old Password is incorrect.")
    }

    user.password = newPassword;
    await user.save({ validationBeforeSave: false })

    res.status(200).json(new apiResponce(200, {}, "Password Updated."))
})

const getUser = asyncHandeler(async (req, res) => {
    res.status(200).json(new apiResponce(200, req.user, "Fetched user Successfully"))
})
const updateUserDetails = asyncHandeler(async (req, res) => {
    const { email, username, fullname } = req.body

    [email, username, fullname].forEach(element => {
        if (element === '' || !element) {
            throw new apiErrors(400, "Some Field is missing")
        }
    });

    let userExists = await User.find({
        $or: [{ username, email }]
    })

    if (userExists) {
        userExists.forEach(elem => {
            if (element.username === username) {
                throw new apiErrors(401, "Username is already exists..")
            }
            if (element.email === email) {
                throw new apiErrors(401, "Email is already exists..")
            }
        })
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: [{ username, fullname, email }]
        }, { new: true }
    ).select("-password -refreshToken")

    res.status(200).json(new apiResponce(200, user, "Updated sucessfully"))
    //As per required.......
})

const userChanneleDetails = asyncHandeler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        new apiErrors(401, "Username is missing.")
    }
    const channel = await User.aggregate([
        {
            $match: { username: username?.toLowerCase() }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "mySubscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                mySubscribersCount: {
                    $size: "$mySubscribers"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscriptions:subscriptions"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                mySubscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
            }
        }
    ])

    if (!channel?.length) {
        throw new apiErrors(404, "Channel not found.")
    }

    res.status(200).json(new apiResponce(200, channel[0], "Channel details fetched successfully"));
})

const updateAvatar = asyncHandeler(async (req, res) => {
    const avatarPath = req.file?.path
    if (!avatarPath) {
        throw new apiErrors(400, "Avatar not found.")
    }
    const avatar = await cloudinaryUpload(avatarPath)
    if (!avatar.url) {
        throw new apiErrors(500, "Error while uploading. Try again later.")
    }
    const oldAvatar = req.user.avatar
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: [{ avatar }]
        }, { new: true }).select("-password -refreshToken")
    cloudinaryDelete(oldAvatar)
    res.status(200).json(new apiResponce(200, user, "Avatar updated successfully."))
})

const watchHistory = asyncHandeler(async (req, res) => {
    const watchHistory = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Schema.ObjectId(req.user._id) //NOTE: req.user.id is a string and we require mongoose id.
            },
            $lookup: {
                from: 'videos',
                localField: 'watchHistory',
                foreignField: '_id',
                as: 'watchHistory',
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'owner',
                            pipeline: [{
                                $project: {
                                    username: 1,
                                    fullname: 1,
                                    avatar: 1,
                                    coverImage: 1
                                }
                            }]
                        },
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }

                    }

                ]
            }
        }
    ])
})

//TODO:build other conrollers, routes, dbModels also..
export { registerUser, userLogin, logout, regenerateToken, changePassword, getUser }