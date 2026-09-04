import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import dbConnect from "./config/db.js";
import router from "./routes/auth.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors(
    {
        origin:process.env.FRONTEND_URL,
        credentials:true,
    }
))

app.use("/api/auth", router)

const PORT = process.env.PORT || 3001
dbConnect();


app.get("/", (req,res) => {
    res.send("Hello from Auth")
})

app.listen(PORT, () => {
    console.log(`App is listening at PORT ${PORT}`)
})

