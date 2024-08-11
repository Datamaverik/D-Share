import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config();

export default cleanEnv(process.env, {
  FRONT_END_URL: str(),
  FRONT_END_PORT: port(),
  PORT: port(),
  MONGO_URI: str(),
  JWT_SECRET: str(),
  GITHUB_CLIENT_ID: str(),
  GITHUB_CLIENT_SECRET: str(),
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
});
