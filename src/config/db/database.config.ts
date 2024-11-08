import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class Database {
  public static async connect(): Promise<void> {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error("La variable d'environnement MONGODB_URI n'est pas définie.");
      return;
    }

    try {
      await mongoose.connect(uri, {});
      console.log("MongoDB connecté");
    } catch (err) {
      console.error("Erreur de connexion à MongoDB :", err);
    }
  }
}

export default Database;
