
import express from "express"
import { createProject, deleteProject, getPorjectByid, getProjects, getStarredProject, toggleStar } from "../controller/project.controller.js";

const router = express.Router();

router.post("/"  , createProject)
router.get("/"  , getProjects)
router.get("/:id"  , getPorjectByid)
router.get("/starred"  , getStarredProject)
router.patch("/:id"  , toggleStar)
router.delete("/:id"  , deleteProject)



export default router