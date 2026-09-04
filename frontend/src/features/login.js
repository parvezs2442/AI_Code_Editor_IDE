import { api } from "../utils/axios"


export const login  =async(token) => {
    try{
        const data = await api.post("/api/auth/login", {token})
        return data
    }catch(error){
        console.log("errors sending data from login ", error)
    }
}