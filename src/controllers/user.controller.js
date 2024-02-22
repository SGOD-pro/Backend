import asyncHandeler from "../utils/asyncHandeler.js";

const registerUser = asyncHandeler(async (req, res) => {
    res.status(269).json({
        message:'All set'
    })
})

export {registerUser}