import mongoose, { Document, Schema, Model, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'agent_immobilier';  
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['client', 'agent_immobilier'],  
    default: 'client'  
  }
});

const UserModel: Model<IUser> = model<IUser>("User", UserSchema);

class User {
  public static async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  }
}

export { UserModel, User };
