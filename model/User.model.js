import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword : {
        type : String,
        default : ""
    },
    role: {
        type: String,
        enum: ["user","Admin"],
        default: "user", 
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    verificationToken:{
        type: String,
    },
    resetPasswordToken:{
        type: String,
    },
    resetPasswordExpiry:{
        type:Date,
    }
},{
    timestamps: true
})

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.method.generateAccessToken = function(){
    return jwt.sign({
        _id : this.id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    } 
)
}

userSchema.method.generateRefreshToken = function(){
    return jwt.sign({
        _id : this.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    } 
)
}



const User = mongoose.model("User", userSchema)


export default User


