import { AnnonceModel, IAnnonce } from "../models/Annonce";

export class AnnonceService {
  /**
   * Create a new annonce.
   * @param data - Partial data for creating an annonce
   * @returns The created annonce
   */
  public static async createAnnonce(data: Partial<IAnnonce>): Promise<IAnnonce> {
    try {
      const annonce = new AnnonceModel(data);
      return await annonce.save();
    } catch (error) {
      console.error('Error creating annonce:', error);
      throw new Error('Failed to create annonce');
    }
  }

  /**
   * Retrieve all annonces.
   * @returns A list of all annonces
   */
  public static async getAnnonces(): Promise<IAnnonce[]> {
    try {
      return await AnnonceModel.find().exec();
    } catch (error) {
      console.error('Error fetching annonces:', error);
      throw new Error('Failed to retrieve annonces');
    }
  }

  /**
   * Retrieve an annonce by ID.
   * @param id - The ID of the annonce to retrieve
   * @returns The annonce with the given ID or null if not found
   */
  public static async getAnnonceById(id: string): Promise<IAnnonce | null> {
    try {
      return await AnnonceModel.findById(id).exec();
    } catch (error) {
      console.error(`Error fetching annonce with id ${id}:`, error);
      throw new Error('Failed to retrieve annonce');
    }
  }

  /**
   * Update an annonce by ID.
   * @param id - The ID of the annonce to update
   * @param data - Partial data for updating the annonce
   * @returns The updated annonce or null if not found
   */
  public static async updateAnnonce(
    id: string,
    data: Partial<IAnnonce>
  ): Promise<IAnnonce | null> {
    try {
      return await AnnonceModel.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error) {
      console.error(`Error updating annonce with id ${id}:`, error);
      throw new Error('Failed to update annonce');
    }
  }

  /**
   * Delete an annonce by ID.
   * @param id - The ID of the annonce to delete
   * @returns The deleted annonce or null if not found
   */
  public static async deleteAnnonce(id: string): Promise<IAnnonce | null> {
    try {
      return await AnnonceModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error(`Error deleting annonce with id ${id}:`, error);
      throw new Error('Failed to delete annonce');
    }
  }
}

export default AnnonceService;
