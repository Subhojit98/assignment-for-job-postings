import { Router } from "express";
import { userSearchedJobs } from "../controllers/userSearch.js";

const router = Router()

router.route("/jobs").get(userSearchedJobs)

export default router