import { Router } from "express";
import { logout, registerUser, userLogin } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { isVerifiedJWT } from "../middlewares/auth.middleware.js";
const router = Router()
router.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]), registerUser)
router.route('/login').post(userLogin)
router.route('/logout').post(isVerifiedJWT, logout)
export default router;