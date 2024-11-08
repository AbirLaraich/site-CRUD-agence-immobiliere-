// src/controllers/AnnonceController.ts
import { Request, Response } from "express";
import AnnonceService from "../services/AnnonceService";
import { LocalStorage } from "node-localstorage";
import { Annonce, AnnonceModel, IAnnonce } from "../models/Annonce";
import { Types } from "mongoose";
import { IUser } from "../models/User";

const localStorage = new LocalStorage("./scratch");
class AnnonceController {
  //frontController
  // Méthode pour afficher la liste des annonces
  public static async renderAnnoncesList(req: Request, res: Response) {
    try {
        const user = req.user as IUser | undefined; 
        let annonces = await AnnonceService.getAnnonces();
        console.log("Utilisateur:", user);
        
        if (!user || user.role !== "agent_immobilier") {
            annonces = annonces.filter((annonce) => annonce.statutPublication === 'publiée');
        }

        res.render("annonce/index", { annonces, user }, (err, html) => {
            if (err) {
                console.error("Erreur de rendu pour annonce/index:", err);
                res.status(500).send("Erreur interne - problème de rendu de la vue.");
            } else {
                res.send(html);
            }
        });
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error("Erreur dans renderAnnoncesList:", errorMessage);
        res.status(500).json({ error: errorMessage });
    }
}


  // Méthode pour afficher le formulaire de création d'une annonce
  public static renderCreateAnnonceForm(req: Request, res: Response) {
    res.render("annonce/new");
  }

  // Méthode pour afficher le formulaire de modification d'une annonce
  public static async renderEditAnnonceForm(req: Request, res: Response) {
    try {
      const annonce = await AnnonceService.getAnnonceById(req.params.id);
      if (!annonce)
        return res.status(404).json({ message: "Annonce non trouvée" });
      res.render("annonce/edit", { annonce });
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async create(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      const photos = files.map((file) => ({ url: `uploads/${file.filename}` }));

      const newAnnonce: Partial<IAnnonce> = {
        ...req.body,
        photos,
      };

      const annonce = await AnnonceService.createAnnonce(newAnnonce);
      res.redirect("/annonce");
    } catch (error) {
      res
        .status(500)
        .json({
          error: error instanceof Error ? error.message : "Unknown error",
        });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const annonce = await AnnonceService.updateAnnonce(
        req.params.id,
        req.body
      );
      if (!annonce)
        return res.status(404).json({ message: "Annonce non trouvée" });
      res.redirect("/annonce");
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public static async getAll(req: Request, res: Response) {
    try {
      const annonces = await AnnonceService.getAnnonces();
      res.status(200).json(annonces);
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async getById(req: Request, res: Response) {
    try {
      const annonce = await AnnonceService.getAnnonceById(req.params.id);
      if (!annonce)
        return res.status(404).json({ message: "Annonce non trouvée" });
      res.status(200).json(annonce);
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const annonce = await AnnonceService.deleteAnnonce(req.params.id);
      if (!annonce)
        return res.status(404).json({ message: "Annonce non trouvée" });
      res.status(200).json({ message: "Annonce supprimée avec succès" });
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async poserQuestion(
    req: Request,
    res: Response
  ): Promise<void> {
    const annonceId = req.params.annonceId;
    const { question } = req.body;

    try {
      const annonce: IAnnonce | null = await AnnonceModel.findById(annonceId);

      if (!annonce) {
        res.status(404).send("Annonce non trouvée");
        return;
      }

      if (!req.user) {
        res.status(401).send("Utilisateur non authentifié");
        return;
      }

      const nouvelleQuestion = {
        _id: new Types.ObjectId(),
        question: question,
      };

      annonce.questionsPosees = annonce.questionsPosees || [];
      annonce.questionsPosees.push(nouvelleQuestion);

      await annonce.save();

      res.redirect("/");
    } catch (error) {
      console.error("Erreur lors de la soumission de la question:", error);
      res.status(500).send("Erreur serveur");
    }
  }

  public static async repondreQuestion(
    req: Request,
    res: Response
  ): Promise<void> {
    const annonceId = req.params.annonceId;
    const questionId = req.params.questionId;
    const { reponse } = req.body;

    try {
      const annonce: IAnnonce | null = await AnnonceModel.findById(annonceId);

      if (!annonce) {
        res.status(404).send("Annonce non trouvée");
        return;
      }

      const question = annonce.questionsPosees?.find(
        (q) => q._id.toString() === questionId
      );

      if (!question) {
        res.status(404).send("Question non trouvée");
        return;
      }

      question.reponse = reponse;
      await annonce.save();
      res.redirect(`/`);
    } catch (error) {
      console.error("Erreur lors de la réponse à la question:", error);
      res.status(500).send("Erreur serveur");
    }
  }
}

export default AnnonceController;
