import User from "../model/User.model.js"
import crypto from "crypto"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"



const registerUser = async (req,res) => {
    // get data (done)
    // validate
    // check if user already exists
    // create a user in db  
    // create a verification token
    // save token in db
    // sent token as email to user
    // send success status to user
/*********************** CODE *************************/
    
    //? Get data
        const {name, email, password} =  req.body    

    //? Validate the data
    if(!name || !email || !password ){
        return res.status(400).json({
            message : "All fields are required",
        })
    }
    // console.log(req.body);

    // email validation

    if(!email.includes('@') || email==null){
        return res.status(400).json({
            message : "Enter valid email address"
        })
    }
    // password validation list   
    
    // TODO : make validation functions or methods in validators.js file
 
    if(password.length < 6 || password.length > 12){
        return res.status(400).json( {
            message:"Enter the password!! it doesnt meet the required structure"
        })   
    }
    

    
    // checking if user is exists or not

    try {
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({
                message : "User already exists"
            })
        }

        console.log(existingUser.name);
        

        // creating a user in db

        const user = await User.create({
            name, email, password
        })
        console.log(user);
        

        if(!user){
            return res.status(400).json({
                message : "User not registered"                
            })
        }
        
        // creating verification token

        const token = crypto.randomBytes(32).toString("hex")
        
        console.log(token);
        
        user.verificationToken = token

        await user.save()

        // sending token as email to user
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // true for port 465, false for others ports
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            },
        });
        
        const mailOptions = {
            from : process.env.MAILTRAP_SENDEREMAIL,
            to : user.email,
            subject : "Verify your email",
            text : `Please click on the following link :${process.env.BASE_URL}/api/v1/users/verify/${token} `,
            html : '<a href="${process.env.BASE_URL}/api/v1/users/verify/${token}">Click here!!</a>'
        };

        await transporter.sendMail(mailOptions)

        res.status(201).json({
            message : "User Registered Successfully",
            success : true
        })
         

    } catch (error) {
        res.status(400).json({
            message : "User not registered", 
            error,
            success : false
        })        
    }
} // Checked -- Working Properly

const verifyUser = async (req, res) => {
    // algorithm

    // get token from url
    // validate token is present or not
    // find user based on token
    // if not (to hum error msg dedenge) 
    // if yes
    // set isVerified field to true
    //  remove verificationToken from db
    // save and return response

    // getting token from url
    const {token} = req.params;
    console.log(token);
    
    
    try {
        // validating the token
        
        if(!token){
            return res.status(400).json({
                message : "Invalid token"
            })
        }
        
        // finding user based on token

        const user = await User.findOne({verificationToken: token})    
        // if user not there

        console.log(user);
        


        if(!user){
            return res.status(400).json({
                message : "Invalid token"
            })
        }
        console.log("user was there");

        // if yes then set verified field to true

        user.isVerified = true


        // removing verification token

        user.verificationToken = undefined
    

        // save and return response 

        await user.save()

        res.status(200).json({
            message : "User verified successfully",
            success : true
        })
        
        
    } catch (error) {
        res.status(404).json({
            message:"User not found",
            success : false
        })
    }

    

    

} // Checked -- Working Properly

const login = async (req, res) => {
    // get data 

    const {email, password} = req.body

    // validate fields

    if(!password || !email){
        return res.status(400).json({
            message : "All fields are required"
        })
    }

    // verify the login credentials in DB

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message : "Invalid Email or password"
            })
        }
    
    // check the password
    
    const isMatch = await bcrypt.compare(password, user.password)

    console.log(isMatch);

    if(!isMatch){
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    // checking if user is verified or not

    if(!user.isVerified){
        return res.status(400).json({
            message: "User is not verified"
        })
    }

    // creating token using JWT

    const token = jwt.sign(
        {id: user._id, role: user.role}, 
        process.env.JWT_SECRET, 
        {
            expiresIn : '24h'
        }
    )

    const cookieOptions  = {
        httpOnly: true,
        secure: true,
        maxAge: 24*60*60*1000
    } 


    // sending token to client's cookies

    res.cookie("token", token, cookieOptions)


    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role
        }
    })

    } catch (error) {
        res.status(400).json({
            message : "User not logged in",
            success: false,
            error
        })
    }

    
} // Checked -- Working Properly

const profile = async (req, res) => {  
    try{

        const user = await User.findById(req.user.id).select('-password') // ye chiz samajh nhi aa rhi?
        console.log(user);

        
        if(!user){
            return res.status(400).json({
                success : false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success : true, 
            user : {
                id : user.id,
                name : user.name,
                role : user.role
            }
        })
           

    } catch (error) {
        res.status(500).json({
            success : false,
            error,
            message : "INTERNAL ERROR WHILE GETTING YOUR PROFILE"
        })
        
    }
} // Checked -- Working Properly

const logoutUser = async (req, res) => {
    try {
        res.cookie('token', '', {
            expires : new Date(0) 
        })
        res.status(200).json({
            message : "Logged out successfully",
            success : true,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
            message : "Internal Error while logging out"
        })
    }
} // Checked -- Working Properly

const forgotPassword = async (req, res) => {
    
    try {
        // get email
        // find user based on email
        
        const {email} = req.body

        if(!email){
            return res.status(400).json({
                message : "Email is required",
                success : false
            })
        }

        const user = await User.findOne({email})

        console.log(user);
        
        if(!user){
            return res.status(400).json({
                message : "No user found with this email"
            })
        }
    
        // reset token + reset expiry => Date.now() + 10 * 60 * 1000 => user.save()
        
        const resetToken = crypto.randomBytes(32).toString("hex")

        console.log(`RESET TOKEN : ${resetToken}`);

        if(!resetToken){
            return res.status(500).json({
                success : false,
                error,
                message : "reset token not generated"
            })
        }

        user.resetPasswordToken = resetToken

        user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000

        await user.save()
        
        // send mail => design url

        console.log("nodemailer setted");
        const transporter = nodemailer.createTransport({
            host : process.env.MAILTRAP_HOST,
            port : process.env.MAILTRAP_PORT,
            secure : false,
            auth : {
                user : process.env.MAILTRAP_USERNAME,
                pass : process.env.MAILTRAP_PASSWORD
            }
        })
        

        const mailOptions = {
            from : process.env.MAILTRAP_SENDEREMAIL,
            to : user.email,
            subject : `Forgot Password link`,
            text : `Hello ${user.name} !! \n
                    Please click on the link to reset yor password \n\n 
                    ${process.env.BASE_URL}/api/v1/users/reset-password/${resetToken}
                    `,
            html : '<a href="${process.env.BASE_URL}/api/v1/users/resetPassword/${resetToken}"> Click here to reset your passsword </a>'
        }

        await transporter.sendMail(mailOptions)
        
        console.log("Mail was sended");
        

        res.status(200).json({
            success : true,
            message : "Forgot password successfully done",
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role,
            }
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            error,
            message : "Internal server error"
        })
    }
} // Checked -- Working Properly

const resetPassword = async (req, res) => {
    try {
        //collect token from params
        const {resetToken} = req.params
        
        console.log(resetToken);
        
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpiry: {$gt : Date.now()}     
        })

        if(!user){
            return res.status(400).json({
                success : false,
                message : "Invalid or Expired reset token"
            })
        }
        
        console.log(user);
        
        //getting password from req.body
        const {password, confirmPassword} = req.body

        if(!password){
            return res.status(400).json({
                success : false,
                message : "Password is required"
            })
        }
        
        // TODO : make validation functions or methods in validators.js file
 
        if(password.length < 6 || password.length > 12){
            return res.status(400).json( {
                message:"Enter the password!! it doesnt meet the required structure"
            })   
        }

        if(!confirmPassword){
            return res.status(400).json( {
                message:"Confirm password field is required"
            })  
        }
        
        if(password != confirmPassword){
            return res.status(400).json( {
                message:"Please enter valid password"
            })  
        }

        // set password in user
        user.password = password

        // resetToken, resetExpiry => reset
        user.resetPasswordToken = undefined
        user.resetPasswordExpiry = undefined

        // save and return res
        await user.save()
        console.log("done");
             
        
        res.status(200).json({
            success: true,
            message: "Your password has been reset successfully. You can now log in with your new password."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
            message: "An error occurred while resetting your password. Please try again later."
        })
      }
} // Checked -- Working Properly

export {registerUser, verifyUser, login, profile, logoutUser, forgotPassword, resetPassword}                     