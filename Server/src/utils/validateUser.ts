import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import { signUpBody } from "../controllers/users";

export const validateUser = (user: signUpBody) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().max(255).email().required(),
    password: passwordComplexity({
      min: 8,
      max: 255,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
    }),
  });

  return schema.validate(user);
};
