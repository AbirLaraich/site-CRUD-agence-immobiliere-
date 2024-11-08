import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.redirect('/annonce'); 
  }
  next(); 
};

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next(); 
    }
    res.redirect('/auth/signin'); 
};

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
  }
  next(); 
};
  