import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { isAuthenticated } from "../middleware/AuthMiddleware";

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/signup", AuthController.renderSignup);
    this.router.get("/existinguser", AuthController.renderExistingUser);
    this.router.get("/signin", isAuthenticated, AuthController.renderSignin);

    this.router.post("/signup", AuthController.signup);
    this.router.post("/signin", AuthController.signIn);
    this.router.get("/logout", AuthController.logout);
  }
}

export default new AuthRoutes().router;
