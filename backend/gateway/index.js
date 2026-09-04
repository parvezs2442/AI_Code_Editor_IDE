import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"


dotenv.config();

const app = express();
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
}))


app.use("/api/auth", proxy(process.env.AUTH_URL, {
    proxyReqPathResolver: (req) => `/api/auth${req.url}`
}))


app.get("/", (req,res) => {
    res.send("Hello from Gateway")
})


app.listen(3000, () => {
    console.log("Gateway is running")
})