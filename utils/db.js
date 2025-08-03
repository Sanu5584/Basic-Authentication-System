import mongoose from "mongoose";

// export a function that connects to db

const db = () => {
    mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error while connecting to the database",err);  
    })
}

export default db
