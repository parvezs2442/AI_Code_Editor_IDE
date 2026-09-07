import { createContext, useContext, useEffect, useState } from "react"
import { getMe, devLogin } from "../features/auth"

const AuthContext = createContext(null)

const DEFAULT_DEV_USER = {
    _id: "675000000000000000000001",
    userId: "675000000000000000000001",
    name: "Ayush Sahu",
    email: "ayush@vertexai.dev",
    avatar: ""
}

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("vertex_user") || "null")
        } catch {
            return null
        }
    })
    const [loading, setLoading] = useState(!user)

    const setUser = (u) => {
        setUserState(u)
        if (u) {
            localStorage.setItem("vertex_user", JSON.stringify(u))
        } else {
            localStorage.removeItem("vertex_user")
        }
    }

    useEffect(() => {
        const hydrateUser = async () => {
            try {
                // 1. Check existing server session
                const data = await getMe()
                if (data?.success && data?.user) {
                    setUser(data.user)
                    setLoading(false)
                    return
                }

                // 2. Auto-login on backend in dev mode
                try {
                    const devData = await devLogin()
                    if (devData?.success && devData?.user) {
                        setUser(devData.user)
                        setLoading(false)
                        return
                    }
                } catch {
                    // Backend dev-login endpoint fallback
                }

                // 3. Fallback dev user if not logged in
                const cachedUser = JSON.parse(localStorage.getItem("vertex_user") || "null")
                if (cachedUser) {
                    setUser(cachedUser)
                } else {
                    setUser(DEFAULT_DEV_USER)
                }
            } catch (err) {
                console.error("Hydration error:", err)
                setUser(DEFAULT_DEV_USER)
            } finally {
                setLoading(false)
            }
        }

        hydrateUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

