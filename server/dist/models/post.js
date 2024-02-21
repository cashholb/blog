"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.ObjectId, ref: 'User', required: true },
    title: { type: String, minLength: 1, maxLength: 50 },
    content: { type: String, required: true, minLength: 1 },
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Comment' }],
    timeStamp: { type: Date, default: Date.now, required: true },
    published: { type: Boolean, default: false },
    likeCount: { type: Number, default: 0 },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }]
});
exports.default = mongoose_1.default.models.Post || mongoose_1.default.model('Post', PostSchema);
