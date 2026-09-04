
import {app} from "../config/firebase.js"
import {getAuth} from "firebase-admin/auth"

const login = async(req,res) => {
    try{
        const {token} = req.body;
        const decoded = await getAuth(app).verifyIdToken(token)
        console.log("✅ Decoded token:", decoded)
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: decoded
        })
    }catch(error){
        console.log("Error", error)
        return res.status(400).json({
            success: false,
            message: "Can't login user"
        })
    } 
}


export default login
