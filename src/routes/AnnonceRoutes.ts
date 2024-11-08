import { Router } from "express";
import AnnonceController from "../controllers/AnnonceController";
import upload from "../middleware/Upload";
import { isAuthenticated, isAuthorized } from "../middleware/AuthMiddleware";

class AnnonceRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Routes Frontend
    this.router.get("/", AnnonceController.renderAnnoncesList);
    this.router.get("/new", isAuthorized, AnnonceController.renderCreateAnnonceForm);
    this.router.get("/edit/:id", isAuthorized, AnnonceController.renderEditAnnonceForm);

    // Routes Backend API
    this.router.post("/api", isAuthorized, upload.array("photos"), AnnonceController.create);
    this.router.get("/api/all", isAuthorized, AnnonceController.getAll);
    this.router.get("/api/:id", isAuthorized, AnnonceController.getById);
    this.router.put("/api/:id", isAuthorized, AnnonceController.update);
    this.router.delete("/api/:id", isAuthorized, AnnonceController.delete);
    this.router.post(
      "/:annonceId/poser-question",
      isAuthorized,
      AnnonceController.poserQuestion
    );
    this.router.post(
      "/:annonceId/questions/:questionId/repondre",
      isAuthorized,
      AnnonceController.repondreQuestion
    );
  }
}

export default new AnnonceRoutes().router;
