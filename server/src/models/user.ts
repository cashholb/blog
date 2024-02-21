import { InferSchemaType, model, Schema } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, maxLength: 20, minLength: 3 },
  email: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, maxLength: 100, minLength: 3},
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>('User', userSchema);