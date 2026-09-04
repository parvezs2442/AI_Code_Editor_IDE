import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firebaseUID:{
        type:String,
        required:true,
    },
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },

}, {timestamps:true } )

const User = mongoose.model("User", userSchema)
module.exports = User