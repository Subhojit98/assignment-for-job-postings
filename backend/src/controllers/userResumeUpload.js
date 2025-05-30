import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponce } from "../utils/apiResponce.js"
import fs from "fs"
import path from "path";
import { Jobs } from "../models/jobs.models.js";
import pdfParse from "pdf-parse";

import mammoth from "mammoth"

function extractKeywords(text) {
    return text
        ?.toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2)
}

async function predictRolesFromText(text) {
    const resumeWords = extractKeywords(text);
    const jobTitles = await Jobs.distinct("job_title");

    const titleScores = jobTitles.map((title) => {
        if (typeof title !== 'string') return { title, score: 0 };

        const titleWords = extractKeywords(title);
        const matchCount = titleWords.filter(word => resumeWords.includes(word)).length;

        return { title, score: matchCount };
    });

    const filteredTitles = titleScores
        .filter(({ score }) => score >= 2)
        .sort((a, b) => b.score - a.score)
        .map(({ title }) => title);

    return filteredTitles.length > 0 ? filteredTitles : ["DevOps Engineer"];
}



const uploadResumePdf = asyncHandler(async (req, res) => {

    if (!req?.file) {
        throw new ApiError(404, "Uploaded Resume not found!!")
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let resumeText = '';

    if (ext === '.pdf') {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        resumeText = data.text;

    } else if (ext === '.docx' || ext === '.doc') {
        const buffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer });
        resumeText = result.value;

    } else {
        throw new ApiError(406, 'Unsupported file type');
    }
    const predictions = await predictRolesFromText(resumeText);
    const regexQueries = predictions.map((title) => ({
        job_title: { $regex: title, $options: "i" },
    }));

    const matchedJobs = await Jobs.find({
        $or: regexQueries,
    });



    fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
    })

    return res.status(200).json(
        new ApiResponce(200, {
            predictions,
            jobs: matchedJobs
        }, "Prediction successful")
    )
})

export { uploadResumePdf }