import { Document, Schema, Model, model, Types } from "mongoose";

interface Photo {
  url: string;
  description?: string;
}

interface Question {
  _id: Types.ObjectId;
  question: string;
  reponse?: string;
}

const PhotoSchema: Schema = new Schema({
  url: { type: String, required: true },
  description: { type: String },
});

const QuestionSchema: Schema = new Schema({
  question: { type: String, required: true },
  reponse: { type: String },
}, { _id: true });

export interface IAnnonce extends Document {
  titre: string;
  typeBien: "vente" | "location";
  statutPublication: "publiée" | "non publiée";
  statutBien: "disponible" | "loué" | "vendu";
  description: string;
  prix: number;
  dateDisponibilite: Date;
  photos?: Photo[];
  questionsPosees?: Question[];
}

const AnnonceSchema: Schema<IAnnonce> = new Schema<IAnnonce>({
  titre: { type: String, required: true },
  typeBien: { type: String, enum: ["vente", "location"], required: true },
  statutPublication: {
    type: String,
    enum: ["publiée", "non publiée"],
    required: true,
  },
  statutBien: {
    type: String,
    enum: ["disponible", "loué", "vendu"],
    required: true,
  },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  dateDisponibilite: { type: Date, required: true },
  photos: [PhotoSchema],
  questionsPosees: [QuestionSchema],
});

const AnnonceModel: Model<IAnnonce> = model<IAnnonce>("Annonce", AnnonceSchema);

class Annonce {
  public static async createAnnonce(
    data: Partial<IAnnonce>
  ): Promise<IAnnonce> {
    const annonce = new AnnonceModel(data);
    return annonce.save();
  }
}

export { AnnonceModel, Annonce };
