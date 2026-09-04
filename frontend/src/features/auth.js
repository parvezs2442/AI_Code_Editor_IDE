import { api } from "../utils/axios"

export const getMe = async () => {
    try {
        const res = await api.get("/api/auth/me")
        return res.data
    } catch {
        return null
    }
}

export const logoutUser = async () => {
    try {
        const res = await api.post("/api/auth/logout")
        return res.data
    } catch (error) {
        console.log("Logout error:", error)
    }
}
