import app from "./app.js";
import { connectDataBase } from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./env"
})


connectDataBase()
    .then(() => {

        app.on("error", (error) => {
            console.log("App Error before listening: ", error)
            throw error
        })

        app.listen(process.env.PORT || 8001, () => {
            console.log("server is running ar port:", process.env.PORT)
        })
    })
    .catch((err) => {
        console.log("MONGODB connection failed!", err)
    })