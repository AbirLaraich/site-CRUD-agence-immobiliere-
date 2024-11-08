import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";
import passport from "passport";
import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./scratch');
export class AuthController {
  public static renderSignup(req: Request, res: Response): void {
    res.render("signup");
  }
  public static renderExistingUser(req: Request, res: Response): void {
    res.render("existinguser");
  }

  public static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { name, email, password, role } = req.body;
      const existingUser = await UserService.findUserByEmail(email);

      if (existingUser) {
        return res.redirect("/existinguser");
      }

      const user = await UserService.createUser({
        name,
        email,
        password,
        role,
      });
      return res.redirect("/auth/signin");
    } catch (error) {
      next(error);
    }
  }

  public static renderSignin(req: Request, res: Response): void {
    res.render("signin");
  }

  public static signIn(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).render("signin", { message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        const storedUser:any = user;

        localStorage.setItem("user", JSON.stringify(storedUser));

        return res.redirect("/annonce");
      });
    })(req, res, next);
  }

  public static logout(req: Request, res: Response, next: NextFunction): void {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      localStorage.setItem("user", JSON.stringify(null));
      res.redirect("/auth/signin");
    });
  }
}
