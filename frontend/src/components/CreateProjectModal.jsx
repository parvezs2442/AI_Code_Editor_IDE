import { useState } from "react";
import "./CreateProjectModal.css";

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Project name is required");
            return;
        }

        setError("");
        setLoading(true);
        try {
            await onCreate({ name: name.trim(), description: description.trim() });
            setName("");
            setDescription("");
            onClose();
        } catch (err) {
            console.error("Modal project creation error:", err);
            setError(err?.response?.data?.message || "Failed to create project. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-header-text">
                        <h3>Create Project</h3>
                        <p>Set up a new workspace in seconds</p>
                    </div>
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="modal-error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="projectName">Project Name</label>
                            <input
                                id="projectName"
                                type="text"
                                className="form-input"
                                placeholder="My Awesome Project"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="projectDesc">Description</label>
                            <textarea
                                id="projectDesc"
                                className="form-textarea"
                                placeholder="What is this project about?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading || !name.trim()}
                        >
                            {loading && <span className="spinner-sm"></span>}
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
