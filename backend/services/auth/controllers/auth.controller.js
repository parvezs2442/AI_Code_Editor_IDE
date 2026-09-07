
import {app} from "../config/firebase.js"
import {getAuth} from "firebase-admin/auth"
import crypto from "crypto"
import redis from "../../../shared/redis/redis.js"
import User from "../models/userModel.js"


export const login = async(req,res) => {
    try{
        const {token} = req.body;
        const decoded = await getAuth(app).verifyIdToken(token)
        
        let user = await User.findOne({
            firebaseUid: decoded.uid
        })
        if(!user){
            user = await User.create({
                firebaseUid:decoded.uid,
                name:decoded.name,
                email:decoded.email,
                avatar:decoded.picture
            })
        }
        
        const sessionID = crypto.randomUUID()
        await redis.set(`session-${sessionID}`,JSON.stringify({
            name:user.name,
            userId:user._id,
            email:user.email,
            avatar:user.avatar,
            createdAt:user.createdAt
        }), "EX",7*24*60*60)

        res.cookie("session", sessionID, {
            httpOnly:true,
            secure:false,
            samesite:"strict",
            maxAge:7*24*60*60*1000
        })


        return res.status(200).json({
            success: true,
            message: "Login successful",
            user
        })
    }catch(error){
        console.log("Error", error)
        return res.status(400).json({
            success: false,
            message: "Can't login user"
        })
    } 
}




export const logout = async(req,res) => {
    try{
        const sessionId = req.cookies?.session
        
        await redis.del(`session-${sessionId}`)
        res.clearCookie("session")

        return res.status(200).json({
            success: true,
            message: "User logged out"
        })

    }catch(error){
        return res.status(400).json({
            success: false,
            message: "Can't logout user"
        })
    }
}


export const me = async(req, res) => {
    try {
        const sessionId = req.cookies?.session
        if (!sessionId) {
            return res.status(401).json({ success: false, message: "No session" })
        }

        const raw = await redis.get(`session-${sessionId}`)
        if (!raw) {
            return res.status(401).json({ success: false, message: "Session expired" })
        }

        const user = JSON.parse(raw)
        return res.status(200).json({ success: true, user })

    } catch(error) {
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

export const devLogin = async (req, res) => {
    try {
        console.log("[Auth Service] devLogin hit");
        let user = await User.findOne({ email: "ayush@vertexai.dev" });
        console.log("[Auth Service] findOne user:", user?._id);
        if (!user) {
            user = await User.create({
                firebaseUid: "dev_user_ayush_vertexai",
                name: "Ayush Sahu",
                email: "ayush@vertexai.dev",
                avatar: ""
            });
            console.log("[Auth Service] user created:", user._id);
        }

        const sessionID = crypto.randomUUID();
        console.log("[Auth Service] sessionID generated:", sessionID);
        await redis.set(`session-${sessionID}`, JSON.stringify({
            name: user.name,
            userId: user._id,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt
        }), "EX", 30 * 24 * 60 * 60);
        console.log("[Auth Service] redis session saved");

        res.cookie("session", sessionID, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Dev login successful",
            user
        });
    } catch (error) {
        console.error("[Auth Service] Dev login error:", error);
        return res.status(500).json({
            success: false,
            message: "Dev login failed"
        });
    }
};


