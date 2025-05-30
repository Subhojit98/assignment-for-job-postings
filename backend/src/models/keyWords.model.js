// models/searchKeyword.model.js
import mongoose from "mongoose";

const searchKeywordSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
        unique: true,
    },
    count: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true
});

export const SearchKeyword = mongoose.model("SearchKeyword", searchKeywordSchema);
