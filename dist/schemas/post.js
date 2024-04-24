"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = exports.MediaSource = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var MediaSource;
(function (MediaSource) {
    MediaSource["UPLOAD"] = "upload";
    MediaSource["TIKTOK"] = "tiktok";
})(MediaSource || (exports.MediaSource = MediaSource = {}));
const postSchema = new mongoose_1.Schema({
    author_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    topic_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Topic",
        required: true,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    shares: {
        type: Number,
        default: 0,
    },
    caption: {
        type: String,
        required: true
    },
    media_url: {
        type: String,
        required: true
    },
    tiktok: {
        type: String,
        required: true
    },
    media_source: {
        type: String,
        enum: MediaSource,
        required: true,
    },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
exports.PostModel = (0, mongoose_1.model)("Post", postSchema);
