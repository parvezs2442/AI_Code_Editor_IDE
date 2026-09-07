import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../features/auth";
import {
    getAllProjects,
    getStarredProjects,
    createProject,
    toggleStarProject,
    deleteProject
} from "../features/projects";
import CreateProjectModal from "../components/CreateProjectModal";
import "./Dashboard.css";

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("projects"); // "projects" | "starred"
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const profileRef = useRef(null);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Load projects whenever activeTab changes
    useEffect(() => {
        let isMounted = true;

        const loadProjects = async () => {
            setLoading(true);
            try {
                const data = activeTab === "starred"
                    ? await getStarredProjects()
                    : await getAllProjects();

                if (isMounted) {
                    setProjects(data?.projects || []);
                }
            } catch (err) {
                console.error("Failed to load projects:", err);
                if (isMounted) {
                    setProjects([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProjects();
        return () => {
            isMounted = false;
        };
    }, [activeTab]);

    // Handle create project
    const handleCreateProject = async (projectData) => {
        const data = await createProject(projectData);
        if (data?.project) {
            setProjects((prev) => [data.project, ...prev]);
        }
    };

    // Handle toggle star
    const handleToggleStar = async (e, projectId) => {
        e.stopPropagation();
        try {
            // Optimistic update
            setProjects((prev) =>
                prev
                    .map((p) => (p._id === projectId ? { ...p, starred: !p.starred } : p))
                    .filter((p) => (activeTab === "starred" ? p.starred : true))
            );

            await toggleStarProject(projectId);
        } catch (err) {
            console.error("Failed to toggle star:", err);
            // Reload on failure
            const data = activeTab === "starred" ? await getStarredProjects() : await getAllProjects();
            setProjects(data?.projects || []);
        }
    };

    // Handle delete project
    const handleDeleteProject = async (e, projectId) => {
        e.stopPropagation();
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;

        try {
            // Optimistic deletion
            setProjects((prev) => prev.filter((p) => p._id !== projectId));
            await deleteProject(projectId);
        } catch (err) {
            console.error("Failed to delete project:", err);
            const data = activeTab === "starred" ? await getStarredProjects() : await getAllProjects();
            setProjects(data?.projects || []);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
            navigate("/login");
        }
    };

    // Name formatting
    const fullName = user?.name || "Ayush Sahu";
    const firstName = fullName.split(" ")[0] || "Ayush";
    const initials = fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "AS";

    return (
        <div className="vertex-app">
            {/* ── Top Navbar ── */}
            <header className="vertex-navbar">
                <div className="vertex-brand">VertexAI</div>

                <div className="vertex-nav-right">
                    {/* Dark mode moon toggle */}
                    <button
                        type="button"
                        className="theme-toggle-btn"
                        aria-label="Toggle theme"
                        title="Dark theme enabled"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    </button>

                    {/* User profile badge & dropdown */}
                    <div className="user-profile-menu" ref={profileRef}>
                        <button
                            type="button"
                            className="user-badge-btn"
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            aria-expanded={isProfileMenuOpen}
                        >
                            <div className="user-avatar-circle">
                                {user?.avatar && !imgError ? (
                                    <img
                                        src={user.avatar}
                                        alt={fullName}
                                        className="user-avatar-img"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <span>{initials}</span>
                                )}
                            </div>
                            <span className="user-name-text">{fullName}</span>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`chevron-icon ${isProfileMenuOpen ? "open" : ""}`}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {isProfileMenuOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-user-info">
                                    <div className="dropdown-name">{fullName}</div>
                                    <div className="dropdown-email">{user?.email || "No email"}</div>
                                </div>
                                <button
                                    type="button"
                                    className="dropdown-item logout"
                                    onClick={handleLogout}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ── App Body ── */}
            <div className="vertex-body">
                {/* ── Sidebar ── */}
                <aside className="vertex-sidebar">
                    <nav className="sidebar-nav">
                        <button
                            type="button"
                            className={`sidebar-nav-btn ${activeTab === "projects" ? "active" : ""}`}
                            onClick={() => setActiveTab("projects")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                            </svg>
                            <span>Projects</span>
                        </button>

                        <button
                            type="button"
                            className={`sidebar-nav-btn ${activeTab === "starred" ? "active" : ""}`}
                            onClick={() => setActiveTab("starred")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span>Starred</span>
                        </button>
                    </nav>

                    {/* Bottom Upgrade Card */}
                    <div className="sidebar-upgrade-card">
                        <div className="upgrade-card-title">Upgrade Plan</div>
                        <div className="upgrade-card-sub">Upgrade to Pro for more credits</div>
                        <button type="button" className="upgrade-btn">
                            <span>⚡</span> Upgrade Now
                        </button>
                    </div>
                </aside>

                {/* ── Main Area ── */}
                <main className="vertex-main">
                    {/* Header */}
                    <div className="main-header">
                        <div className="header-greeting">
                            <h1>Welcome Back, {firstName} 👋</h1>
                            <p>Ready to build something amazing today?</p>
                        </div>
                        <button
                            type="button"
                            className="btn-new-project"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>New Project</span>
                        </button>
                    </div>

                    {/* Section Title */}
                    <h2 className="section-title">
                        {activeTab === "starred" ? "Starred Projects" : "Recent Projects"}
                    </h2>

                    {/* Projects Content Area */}
                    {loading ? (
                        <div className="projects-loading">
                            <div className="skeleton-card">
                                <div className="skeleton-line skeleton-title"></div>
                                <div className="skeleton-line skeleton-desc"></div>
                                <div className="skeleton-line skeleton-footer"></div>
                            </div>
                            <div className="skeleton-card">
                                <div className="skeleton-line skeleton-title"></div>
                                <div className="skeleton-line skeleton-desc"></div>
                                <div className="skeleton-line skeleton-footer"></div>
                            </div>
                        </div>
                    ) : projects.length === 0 ? (
                        /* Empty State (Screenshot 1) */
                        <div className="empty-projects-container">
                            <div className="empty-folder-box">
                                {activeTab === "starred" ? (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ) : (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="empty-title">
                                {activeTab === "starred" ? "No starred projects yet" : "No projects yet"}
                            </h3>
                            <p className="empty-subtitle">
                                {activeTab === "starred"
                                    ? "Star your favorite projects to quickly access them here!"
                                    : "Create your first project and start building something amazing!"}
                            </p>
                        </div>
                    ) : (
                        /* Projects Grid (Screenshot 3) */
                        <div className="projects-grid">
                            {projects.map((project) => (
                                <div
                                    key={project._id}
                                    className="project-card"
                                    title={project.name}
                                >
                                    <div className="project-card-header">
                                        <h3 className="project-card-title">{project.name}</h3>
                                        <button
                                            type="button"
                                            className={`card-star-btn ${project.starred ? "starred" : ""}`}
                                            onClick={(e) => handleToggleStar(e, project._id)}
                                            aria-label={project.starred ? "Unstar project" : "Star project"}
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill={project.starred ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        </button>
                                    </div>

                                    <p className="project-card-desc">
                                        {project.description || "No description provided"}
                                    </p>

                                    <div className="project-card-footer">
                                        <button
                                            type="button"
                                            className="card-delete-btn"
                                            onClick={(e) => handleDeleteProject(e, project._id)}
                                            aria-label="Delete project"
                                            title="Delete project"
                                        >
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* ── Create Project Modal ── */}
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateProject}
            />
        </div>
    );
};

export default Dashboard;
