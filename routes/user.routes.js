import express from "express"
import { registerUser,verifyUser, login, profile, logoutUser, forgotPassword, resetPassword } from "../controller/user.controller.js";
import {isLoggedIn} from "../middleware/auth.middleware.js"


const router = express.Router();
router.post("/register", registerUser)
router.get("/verify/:token", verifyUser)
router.post('/login', login)
router.get('/profile', isLoggedIn ,profile)
router.get('/logout', isLoggedIn, logoutUser)
router.post('/forgot-password/', isLoggedIn, forgotPassword)
router.post('/reset-password/:resetToken', resetPassword)
// router.get('/refresh-token', refreshToken)
 


export default router;