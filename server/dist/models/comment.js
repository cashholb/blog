"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    comment: { type: String, required: true, minLength: 1, maxLength: 250 },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    postId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post' },
    timeStamp: { type: Date, default: Date.now, required: true },
    likeCount: { type: Number, default: 0 },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }]
});
exports.default = mongoose_1.default.models.Comment || mongoose_1.default.model('Comment', CommentSchema);
