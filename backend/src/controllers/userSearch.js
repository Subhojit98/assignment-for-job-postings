import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponce } from "../utils/apiResponce.js"
import { Jobs } from "../models/jobs.models.js";
import { SearchKeyword } from "../models/keyWords.model.js";



const userSearchedJobs = asyncHandler(async (req, res) => {

    const searchQuery = req.query.search
    if (!searchQuery) {
        throw new ApiError(404, "Search query not found")
    }

    const jobs = await Jobs.find({
        job_title: { $regex: new RegExp(searchQuery, 'i') }
    })
    await SearchKeyword.findOneAndUpdate(
        { keyword: searchQuery },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
    );

    return res.status(200).json(
        new ApiResponce(200, jobs, "jobs fetched successfully")
    )

})

export { userSearchedJobs }