import mongoose from "mongoose"

const jobsSchema = new mongoose.Schema({

    company_name: {
        type: String,
        required: true,
    },
    job_title: {
        type: String,
        required: true,
        index: 'text'
    },
    job_location: {
        type: String,
        required: true,
    },
    apply_link: {
        type: String,
        required: true,
    },
    job_description: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    }

}, {
    timestamps: true,
    collection: "all_jobs"
})

export const Jobs = mongoose.model("Job", jobsSchema)