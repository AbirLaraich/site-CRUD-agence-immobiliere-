import express, { Express } from "express";
import dotenv from "dotenv";
import Database from "./config/db/database.config";
import AnnonceRoutes from "./routes/AnnonceRoutes";
import session from "express-session";
import { passportConfig } from "./config/passport/passportConfig";
import AuthRoutes from "./routes/AuthRoutes";
import path from "path";
import MongoStore from "connect-mongo";
import methodOverride from "method-override"; // Import method-override

dotenv.config();

class App {
  public app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT ? parseInt(process.env.PORT) : 8000;
    this.initializeDatabase();
    this.initializeMiddleware();
    this.initializeViewEngine();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.startServer();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await Database.connect();
      console.log("Database connected successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error initializing database:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      process.exit(1);
    }
  }

  private initializeMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(methodOverride("_method"));

    this.app.use(
      session({
        secret: process.env.SESSION_SECRET || "yourSecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
        },
        store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
          collectionName: "sessions",
          ttl: 30 * 60,
        }),
      })
    );
    

    this.app.use(passportConfig.initializePassport());
    this.app.use(passportConfig.initializeSession());

    this.app.use((req, res, next) => {
      res.locals.isAuthenticated = req.isAuthenticated();
      next();
    });
  }

  private initializeViewEngine(): void {
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(__dirname, "../views"));
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    }

  private initializeRoutes(): void {
    this.initializeDefaultRoutes();
    this.initializeAuthRoutes();
    this.initializeAnnonceRoutes();
    this.initializeLogoutRoute();
    this.handleUndefinedRoutes();
  }

  private initializeDefaultRoutes(): void {
    this.app.use("/", AnnonceRoutes);
  }

  private initializeAuthRoutes(): void {
    this.app.use("/auth", AuthRoutes);
  }

  private initializeAnnonceRoutes(): void {
    this.app.use("/annonce", AnnonceRoutes);
  }

  private initializeLogoutRoute(): void {
    this.app.get("/logout", (req, res, next) => {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/signin");
      });
    });
  }

  private handleUndefinedRoutes(): void {
    this.app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.error(err.stack);
        res.status(500).json({ message: "Internal Server Error" });
      }
    );
  }

  private startServer(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}/`);
    });
  }
}

const appInstance = new App().app;
export default appInstance;
