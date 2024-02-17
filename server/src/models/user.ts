import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, maxLength: 20, minLength: 3 },
  password: { type: String, required: true, maxLength: 100, minLength: 3},
});

export default UserSchema;