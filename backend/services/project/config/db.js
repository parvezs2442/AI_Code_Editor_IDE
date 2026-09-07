
import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, "../.env") })

const dbConnect = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is not defined");
        }
        await mongoose.connect(process.env.MONGO_URL)
        console.log("PROJECT DATABASE CONNECTED SUCCESSFULLY")
    } catch (error) {
        console.error("Project database connection error:", error)
    }
}


export default dbConnect