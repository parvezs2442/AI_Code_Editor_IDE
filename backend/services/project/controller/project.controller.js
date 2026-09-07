import redis from "../../../shared/redis/redis.js";
import Project from "../model/project.model.js";

export const createProject = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User Id is required"
            });
        }

        const { name, description } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project name is required"
            });
        }

        const project = await Project.create({
            owner: userId,
            name: name.trim(),
            description: description?.trim() || ""
        });

        // Invalidate user cache
        await redis.del(`projects-${userId}`);
        await redis.del(`starred-projects-${userId}`);

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });
    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({
            success: false,
            message: "Project creation failed"
        });
    }
};

export const getProjects = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User Id is required"
            });
        }

        const key = `projects-${userId}`;
        const cached = await redis.get(key);
        if (cached) {
            return res.status(200).json({
                success: true,
                projects: JSON.parse(cached)
            });
        }

        const projects = await Project.find({
            owner: userId
        }).sort({ updatedAt: -1 });

        await redis.set(key, JSON.stringify(projects), "EX", 120);

        return res.status(200).json({
            success: true,
            message: "Projects retrieved successfully",
            projects
        });
    } catch (error) {
        console.error("Error getting projects:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve projects"
        });
    }
};

export const getStarredProjects = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User Id is required"
            });
        }

        const key = `starred-projects-${userId}`;
        const cached = await redis.get(key);
        if (cached) {
            return res.status(200).json({
                success: true,
                projects: JSON.parse(cached)
            });
        }

        const projects = await Project.find({
            owner: userId,
            starred: true
        }).sort({ updatedAt: -1 });

        await redis.set(key, JSON.stringify(projects), "EX", 120);

        return res.status(200).json({
            success: true,
            message: "Starred projects retrieved successfully",
            projects
        });
    } catch (error) {
        console.error("Error getting starred projects:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve starred projects"
        });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        const { id } = req.params;

        const project = await Project.findOne({ _id: id, owner: userId });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        project.lastOpenedAt = new Date();
        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project found",
            project
        });
    } catch (error) {
        console.error("Error getting project by id:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve project"
        });
    }
};

export const toggleStar = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User Id is required"
            });
        }

        const { id } = req.params;
        const project = await Project.findOne({ _id: id, owner: userId });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        project.starred = !project.starred;
        await project.save();

        // Invalidate both lists in cache
        await redis.del(`projects-${userId}`);
        await redis.del(`starred-projects-${userId}`);

        return res.status(200).json({
            success: true,
            message: project.starred ? "Project starred" : "Project unstarred",
            project
        });
    } catch (error) {
        console.error("Error toggling star:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle star"
        });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User Id is required"
            });
        }

        const { id } = req.params;
        const project = await Project.findOneAndDelete({ _id: id, owner: userId });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Invalidate cache
        await redis.del(`projects-${userId}`);
        await redis.del(`starred-projects-${userId}`);

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            project
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete project"
        });
    }
};

