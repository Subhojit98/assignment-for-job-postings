import express from "express"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb", extended: true }))
app.use(express.static("public"))


import fileUploadRouter from "../src/routes/uploadFile.js"
import searchJobs from "../src/routes/jobSearch.js"
app.use("/upload-file", fileUploadRouter)
app.use("/all-jobs", searchJobs)

export default app