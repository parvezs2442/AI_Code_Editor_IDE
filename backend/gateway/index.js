import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))


app.use("/api/auth", proxy(process.env.AUTH_URL, {
    proxyReqPathResolver: (req) => `/api/auth${req.url}`,
    // Forward the cookie header from client to auth service
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        if (srcReq.headers.cookie) {
            proxyReqOpts.headers["cookie"] = srcReq.headers.cookie
        }
        return proxyReqOpts
    },
    // Forward Set-Cookie from auth service back to client
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        if (proxyRes.headers["set-cookie"]) {
            userRes.setHeader("set-cookie", proxyRes.headers["set-cookie"])
        }
        return proxyResData
    }
}))

app.use("/api/project", proxy(process.env.PROJECT_SERVICE))


app.get("/", (req, res) => {
    res.send("Hello from Gateway")
})


app.listen(3000, () => {
    console.log("Gateway is running on port 3000")
})