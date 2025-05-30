import mongoose from "mongoose"

export const connectDataBase = async () => {

    try {
        const res = await mongoose.connect(`${process.env.MONGODB_URI}/job_postings`)
        console.log("mongoDb connected!!", res.connection.host)
    } catch (error) {
        console.log("MONGODB connection error ", error)
        process.exit(1)
    }
}