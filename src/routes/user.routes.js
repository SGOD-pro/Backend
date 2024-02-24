import { Router } from "express";
import { logout, regenerateToken, registerUser, userLogin } from "../controllers/user.controller.js";
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
router.route('/refresh-token').post(regenerateToken)
export default router;