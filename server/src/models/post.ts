import { InferSchemaType, model, Schema } from 'mongoose';

// Define Post schema
const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, minLength: 1, maxLength: 50 },
  content: { type: String, required: true, minLength: 1 },
  timeStamp: { type: Date, default: Date.now },
  published: { type: Boolean, default: false },
  likeCount: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

type Post = InferSchemaType<typeof postSchema>;


export default model<Post>("Post", postSchema);
