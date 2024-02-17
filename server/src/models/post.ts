import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, minLength: 1, maxLength: 50 },
  message: { type: String, required: true, minLength: 1, maxLength: 2000 },
});

export default PostSchema;