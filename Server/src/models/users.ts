import { InferSchemaType, Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, minLength: 3, maxLength: 255 },
  email: { type: String, required: true, minLength: 3, maxLength: 255 },
  password: { type: String, required: true },
  fullName: { type: String, required: true, minLength: 3, maxLength: 255 },
  avatar: { type: String, default: "https://i.ibb.co/WnTMDjS/default-Pfp.jpg" },
});

type User = InferSchemaType<typeof UserSchema>;
export default model<User>("User", UserSchema);
