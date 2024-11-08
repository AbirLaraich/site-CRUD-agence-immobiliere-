import { IUser, UserModel } from '../models/User';
import bcrypt from 'bcrypt';

export class UserService {
  /**
   * Create a new user with hashed password.
   * @param data - Partial user data
   */
  public static async createUser(data: Partial<IUser>): Promise<IUser> {
    if (!data.password) {
      throw new Error('Password is required to create a user.');
    }
    
    try {
      const hashedPassword = await bcrypt.hash(data.password as string, 10);

      const user = new UserModel({ ...data, password: hashedPassword });
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Find a user by email.
   * @param email - User's email
   */
  public static async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user');
    }
  }

    /**
   * Authenticate a user with email and password.
   * @param email - User's email
   * @param password - User's password
   * @returns The authenticated user or null if authentication fails
   */
    public static async signIn(email: string, password: string): Promise<IUser | null> {
      try {
        const user = await UserService.findUserByEmail(email);
        if (!user) {
          throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password.toString(), user.password);
        console.log("phashed assword" , password)
        console.log("user.password" , user.password)
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
  
        return user;
      } catch (error) {
        console.error('Error during sign-in:', error);
        throw new Error('Failed to sign in');
      }
    }
}