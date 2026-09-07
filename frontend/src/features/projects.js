import { api } from "../utils/axios";

export const getAllProjects = async () => {
    try {
        const res = await api.get("/api/project");
        return res.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

export const getStarredProjects = async () => {
    try {
        const res = await api.get("/api/project/starred");
        return res.data;
    } catch (error) {
        console.error("Error fetching starred projects:", error);
        throw error;
    }
};

export const getProjectById = async (id) => {
    try {
        const res = await api.get(`/api/project/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching project by id:", error);
        throw error;
    }
};

export const createProject = async ({ name, description }) => {
    try {
        const res = await api.post("/api/project", { name, description });
        return res.data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};

export const toggleStarProject = async (id) => {
    try {
        const res = await api.patch(`/api/project/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error toggling star:", error);
        throw error;
    }
};

export const deleteProject = async (id) => {
    try {
        const res = await api.delete(`/api/project/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};
