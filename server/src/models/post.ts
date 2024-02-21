import { InferSchemaType, model, Schema } from 'mongoose';

// Define Post schema
const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likeCount: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

type Post = InferSchemaType<typeof postSchema>;


export default model<Post>("Post", postSchema);
