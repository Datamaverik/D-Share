import * as UserController from "../controllers/users";
import express from "express";

const router = express.Router();

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.get("/loggedInUser", UserController.getLoggedInUser);

router.get("/auth", UserController.authWithGithub);


export default router;
