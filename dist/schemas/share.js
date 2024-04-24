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
exports.ShareMedium = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ShareMedium;
(function (ShareMedium) {
    ShareMedium["X"] = "x";
    ShareMedium["INSTAGRAM"] = "instagram";
    ShareMedium["TIKTOK"] = "tiktok";
    ShareMedium["WHATSAPP"] = "whatsapp";
    ShareMedium["GENERIC"] = "generic";
})(ShareMedium || (exports.ShareMedium = ShareMedium = {}));
const shareSchema = new mongoose_1.Schema({
    post_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    sharerer_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    medium: {
        type: String,
        enum: ShareMedium,
        default: ShareMedium.GENERIC,
    },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
const ShareModel = (0, mongoose_1.model)("Share", shareSchema);
exports.default = ShareModel;
