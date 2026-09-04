import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { logoutUser } from "../features/auth"
import "./Dashboard.css"

const NAV_ITEMS = [
    {
        id: "overview",
        label: "Overview",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
        ),
    },
    {
        id: "editor",
        label: "Code Editor",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
        ),
    },
    {
        id: "profile",
        label: "Profile",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        ),
    },
    {
        id: "settings",
        label: "Settings",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
        ),
    },
]

const STAT_CARDS = [
    { label: "Projects", value: "—", sub: "Coming soon", color: "#7c3aed" },
    { label: "Files Edited", value: "—", sub: "Coming soon", color: "#2563eb" },
    { label: "AI Completions", value: "—", sub: "Coming soon", color: "#06b6d4" },
    { label: "Collaborators", value: "—", sub: "Coming soon", color: "#10b981" },
]

const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    })
}

const getInitials = (name) => {
    if (!name) return "?"
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

const Dashboard = () => {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const [activeNav, setActiveNav] = useState("overview")
    const [loggingOut, setLoggingOut] = useState(false)
    const [imgError, setImgError] = useState(false)

    const handleLogout = async () => {
        setLoggingOut(true)
        await logoutUser()
        setUser(null)
        navigate("/login")
    }

    return (
        <div className="dash-root">
            {/* ── Sidebar ── */}
            <aside className="dash-sidebar">
                <div className="dash-sidebar-brand">
                    <div className="dash-logo">
                        <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
                            <rect width="38" height="38" rx="10" fill="url(#dg)"/>
                            <path d="M11 24.5L16.5 13L22 24.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 21h7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                            <path d="M25 14v10M28 17l-3-3-3 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <defs>
                                <linearGradient id="dg" x1="0" y1="0" x2="38" y2="38">
                                    <stop stopColor="#7C3AED"/><stop offset="1" stopColor="#2563EB"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="dash-brand-name">AI Code Editor</span>
                </div>

                <nav className="dash-nav">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            className={`dash-nav-item ${activeNav === item.id ? "active" : ""}`}
                            onClick={() => setActiveNav(item.id)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="dash-sidebar-footer">
                    {/* Mini user card */}
                    <div className="dash-user-mini">
                        {user?.avatar && !imgError ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="dash-user-mini-avatar"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="dash-user-mini-initials">
                                {getInitials(user?.name)}
                            </div>
                        )}
                        <div className="dash-user-mini-info">
                            <span className="dash-user-mini-name">{user?.name || "User"}</span>
                            <span className="dash-user-mini-email">{user?.email || ""}</span>
                        </div>
                    </div>

                    <button
                        id="logout-btn"
                        className={`dash-logout-btn ${loggingOut ? "loading" : ""}`}
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? (
                            <span className="dash-spinner"></span>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                        )}
                        {loggingOut ? "Signing out…" : "Sign Out"}
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="dash-main">
                {/* Top bar */}
                <header className="dash-topbar">
                    <div>
                        <h1 className="dash-topbar-title">
                            Good {getGreeting()},{" "}
                            <span className="dash-topbar-name">
                                {user?.name?.split(" ")[0] || "Developer"}
                            </span>
                            &nbsp;👋
                        </h1>
                        <p className="dash-topbar-sub">Here's what's happening in your workspace.</p>
                    </div>
                    <div className="dash-topbar-avatar">
                        {user?.avatar && !imgError ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="dash-topbar-img"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="dash-topbar-initials">{getInitials(user?.name)}</div>
                        )}
                    </div>
                </header>

                {/* Profile card */}
                <section className="dash-profile-card">
                    <div className="dash-profile-avatar-wrap">
                        {user?.avatar && !imgError ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="dash-profile-avatar"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="dash-profile-initials">{getInitials(user?.name)}</div>
                        )}
                        <div className="dash-profile-online-dot"></div>
                    </div>
                    <div className="dash-profile-info">
                        <h2 className="dash-profile-name">{user?.name || "—"}</h2>
                        <p className="dash-profile-email">{user?.email || "—"}</p>
                        <div className="dash-profile-meta">
                            <span className="dash-badge dash-badge--green">✓ Verified</span>
                            <span className="dash-badge dash-badge--purple">Google Account</span>
                            <span className="dash-profile-joined">
                                Member since {formatDate(user?.createdAt)}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Stats grid */}
                <section className="dash-stats-grid">
                    {STAT_CARDS.map((card) => (
                        <div key={card.label} className="dash-stat-card" style={{ "--card-color": card.color }}>
                            <div className="dash-stat-glow"></div>
                            <span className="dash-stat-label">{card.label}</span>
                            <span className="dash-stat-value">{card.value}</span>
                            <span className="dash-stat-sub">{card.sub}</span>
                        </div>
                    ))}
                </section>

                {/* Account details */}
                <section className="dash-details-card">
                    <h3 className="dash-section-title">Account Details</h3>
                    <div className="dash-details-grid">
                        <DetailRow label="Full Name"   value={user?.name}  />
                        <DetailRow label="Email"       value={user?.email} />
                        <DetailRow label="User ID"     value={user?.userId} mono />
                        <DetailRow label="Member Since" value={formatDate(user?.createdAt)} />
                        <DetailRow label="Auth Provider" value="Google (Firebase)" />
                    </div>
                </section>
            </main>
        </div>
    )
}

const DetailRow = ({ label, value, mono }) => (
    <div className="dash-detail-row">
        <span className="dash-detail-label">{label}</span>
        <span className={`dash-detail-value ${mono ? "mono" : ""}`}>{value || "—"}</span>
    </div>
)

const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return "morning"
    if (h < 17) return "afternoon"
    return "evening"
}

export default Dashboard
