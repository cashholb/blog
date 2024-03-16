import { InferSchemaType, model, Schema } from 'mongoose';

// Define Comment schema
const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
  likeCount: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

type Comment = InferSchemaType<typeof commentSchema>;

export default model<Comment>("Comment", commentSchema);
