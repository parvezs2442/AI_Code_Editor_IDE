
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const dbConnect = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DATABASE CONNECTED SUCCESSFULLY")

    }catch(error){
        console.log("Error -> ", error)
    }
}

export default dbConnect