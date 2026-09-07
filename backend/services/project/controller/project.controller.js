import { json } from "express";
import redis from "../../../shared/redis/redis.js";
import Project from "../model/project.model.js";


export const createProject = async(req,res) => {
    try{
        const userId = req.headers["x-user-id"]
        if(!userId){
            return res.status(401).json({
                success:false,
                message:"User Id is required"
            })
        }

        const {name, description} = req.body;
        const project = await Project.create({
            owner:userId,
            name,
            description
        })

        const key = `projects-${userId}`
        await redis.del(key)

        return res.status(201).json({
            success:true,
            massage:"Project created",
            project
        })

    }catch(error){
        console.log(error)
        return res.status(401).json({
            success:false,
            massage:"Project creation failed",
        })
    }
}


export const getProjects = async(req,res) => {
    try{
        const userId = req.headers["x-user-id"]
        if(!userId){
            return res.status(401).json({
                success:false,
                message:"User Id is required"
            })
        }

        const key = `projects-${userId}`
        let result = await redis.get(key)
        if(result){
            return res.status(200).json(JSON.parse(result))
        }

        const projects = await Project.find({
            owner:userId
        }).sort({updatedAT:-1})


        await redis.set(JSON.stringify(projects))
        return res.status(201).json({
            success:true,
            massage:"Projects found -> ",
            projects
        })

    }catch(error){
        console.log(error)
        return res.status(401).json({
            success:false,
            massage:"Project get failed",
        })
    }
}

export const getStarredProjects = async(req,res) => {
    try{
       
        const userId = req.headers["x-user-id"]
        if(!userId){
            return res.status(401).json({
                success:false,
                message:"User Id is required"
            })
        }

        const key = `starred-projects-${userId}`
        let result = await redis.get(key)
        if(result){
            return res.status(200).json(JSON.parse(result))
        }

        const projects = await Project.find({
            owner:userId,
            starred:true,
        }).sort({updatesAt:-1})

        await redis.set(JSON.stringify(projects))
        return res.status(201).json({
            success:true,
            massage:"Projects found -> ",
            projects
        })

        return res.status(201).json({
            success:true,
            massage:"Starred Project found",
            projects
        })

    }catch(error){
        console.log(error)
        return res.status(401).json({
            success:false,
            massage:"Starred Project found failed",
        })
    }
}


export const getProjectById = async(req,res) => {
    try{
       
        const {id}  = req.params
        const project = await Project.findById(id)
        project.lastOpenedAt= new Date()
        await project.save()

        return res.status(201).json({
            success:true,
            massage:"Project found",
            project
        })

    }catch(error){
        console.log(error)
        return res.status(401).json({
            success:false,
            massage:"Project find by ID failed",
        })
    }
}


export const toggleStar = async(req,res) => {
    try{    
        const {id}  = req.params
        const project = await Project.findById(id)
        project.starred = !project.starred
        if(!project){
                    return res.status(400).json({
            success:false,
            message:"project not found"
        })
        }
        await project.save()

        const key = `starred-projects-${userId}`
        await redis.del(key)

        return res.status(200).json({
            success:true,
            message:"toggled starred project",
            project
        })
    }catch(error){
        return res.status(200).json({
            success:false,
            message:"toggled starred project failed"
        })
    }
} 


export const deleteProject = async(req,res) => {
    try{    
        const {id}  = req.params
        const project = await Project.findByIdAndDelete(id)
        if(!project){
                return res.status(400).json({
            success:false,
            message:"project not found"
        })
        }

        const key = `projects-${userId}`
        await redis.del(key)

        return res.status(200).json({
            success:true,
            message:"project deleted",
            project
        })
    }catch(error){
        return res.status(200).json({
            success:false,
            message:"delete project failed"
        })
    }
} 
