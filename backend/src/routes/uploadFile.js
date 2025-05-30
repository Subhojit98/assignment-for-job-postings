import { Router } from "express";
import { uploadResumePdf } from "../controllers/userResumeUpload.js";
import upload from "../utils/fileUpload.js";

const router = Router()

router.route("/resume").post(upload.single("resume"), uploadResumePdf)
export default router