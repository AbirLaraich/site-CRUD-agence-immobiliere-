import { AuthController } from "../../controllers/AuthController";
import { Request, Response } from "express";

describe('Auth Routes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should call renderSignup on GET /signup', () => {
      const req = { method: 'GET' } as Request;
      const res = { render: jest.fn() } as unknown as Response;
  
      AuthController.renderSignup(req, res);
  
      expect(res.render).toHaveBeenCalledWith("signup");
    });
  
    it('should call renderSignin on GET /signin', () => {
      const req = { method: 'GET' } as Request;
      const res = { render: jest.fn() } as unknown as Response;
  
      AuthController.renderSignin(req, res);
  
      expect(res.render).toHaveBeenCalledWith("signin");
    });
  
    it('should call renderExistingUser on GET /existinguser', () => {
      const req = { method: 'GET' } as Request;
      const res = { render: jest.fn() } as unknown as Response;
  
      AuthController.renderExistingUser(req, res);
  
      expect(res.render).toHaveBeenCalledWith("existinguser");
    });
  });
  
