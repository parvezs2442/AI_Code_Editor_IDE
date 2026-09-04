import { useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { auth, googleProvider } from "../../firebase"
import { login } from "../features/login"
import { useAuth } from "../context/AuthContext"
import "./LoginPage.css"

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const handleLogin = async () => {
        setLoading(true)
        setError("")
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const token = await result.user.getIdToken()
            const data = await login(token)
            if (data?.data?.success) {
                setUser(data.data.user)
                navigate("/dashboard")
            } else {
                setError("Login failed. Please try again.")
            }
        } catch (err) {
            console.error(err)
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            {/* Animated background orbs */}
            <div className="login-orb login-orb--1"></div>
            <div className="login-orb login-orb--2"></div>
            <div className="login-orb login-orb--3"></div>

            <div className="login-card">
                {/* Logo / Brand */}
                <div className="login-brand">
                    <div className="login-logo">
                        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                            <rect width="38" height="38" rx="10" fill="url(#grad)"/>
                            <path d="M11 24.5L16.5 13L22 24.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 21h7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                            <path d="M25 14v10M28 17l-3-3-3 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7C3AED"/>
                                    <stop offset="1" stopColor="#2563EB"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="login-brand-name">AI Code Editor</span>
                </div>

                {/* Heading */}
                <div className="login-header">
                    <h1 className="login-title">Welcome back</h1>
                    <p className="login-subtitle">
                        Sign in to your workspace and start building with AI-powered code intelligence.
                    </p>
                </div>

                {/* Google Sign-in */}
                <button
                    id="google-signin-btn"
                    className={`login-google-btn ${loading ? "loading" : ""}`}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="btn-spinner"></span>
                            <span>Signing you in…</span>
                        </>
                    ) : (
                        <>
                            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span>Continue with Google</span>
                        </>
                    )}
                </button>

                {error && (
                    <div className="login-error" role="alert">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"/>
                        </svg>
                        {error}
                    </div>
                )}

                {/* Divider / features */}
                <div className="login-features">
                    {["AI-powered completions", "Real-time collaboration", "Multi-language support"].map((f) => (
                        <div key={f} className="login-feature-pill">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <circle cx="6" cy="6" r="6" fill="rgba(124,58,237,0.2)"/>
                                <path d="M3.5 6l2 2 3-3" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {f}
                        </div>
                    ))}
                </div>

                <p className="login-legal">
                    By continuing, you agree to our{" "}
                    <a href="#terms">Terms of Service</a> and{" "}
                    <a href="#privacy">Privacy Policy</a>.
                </p>
            </div>
        </div>
    )
}

export default LoginPage
