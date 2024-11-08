import request from "supertest";
import app from "../../app";

describe("Auth Routes Integration Tests", () => {
  it("devrait rendre la page de signup sur GET /auth/signup", async () => {
    const response = await request(app).get("/auth/signup");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Créer un compte");
    expect(response.text).toContain("S'enregistrer");
  });

  it("devrait rendre la page de signin sur GET /auth/signin", async () => {
    const response = await request(app).get("/auth/signin");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Connexion");
    expect(response.text).toContain("Se connecter");
  });

  it("devrait rendre la page des utilisateurs existants sur GET /auth/existinguser", async () => {
    const response = await request(app).get("/auth/existinguser");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Account Already Exists");
  });
});
