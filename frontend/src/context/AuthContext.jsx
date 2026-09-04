import { createContext, useContext, useEffect, useState } from "react"
import { getMe } from "../features/auth"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const hydrateUser = async () => {
            const data = await getMe()
            if (data?.success) {
                setUser(data.user)
            }
            setLoading(false)
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
