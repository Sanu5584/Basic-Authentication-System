import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js";
import cookieParser from "cookie-parser";

// import all routes
import UserRoutes from "./routes/user.routes.js"

dotenv.config() 
const app = express();// app ke paas express ki shari shaktiya transfer ho rhi hai

app.use(cors({
    origin: process.env.BASE_URL, 
    methods: ['GET','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
})
)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

const port = process.env.PORT || 3000;

// connect to db

db();

//user routes
app.use("/api/v1/users",UserRoutes)


app.listen(port, () => {
    console.log(`Example app is running on port ${port}`)
})