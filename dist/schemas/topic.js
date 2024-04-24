"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicModel = void 0;
const mongoose_1 = require("mongoose");
const topicSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        index: "text",
    },
    posts: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
exports.TopicModel = (0, mongoose_1.model)("Topic", topicSchema);
