import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserService } from '../../services/UserService';
import bcrypt from 'bcrypt';

class PassportConfig {
  constructor() {
    this.initializeLocalStrategy();
    this.serializeUser();
    this.deserializeUser();
  }

  private initializeLocalStrategy(): void {
    passport.use(
      new LocalStrategy(
        { usernameField: 'email' }, 
        async (email, password, done) => {
          try {
            const user = await UserService.findUserByEmail(email);

            if (!user) {
              return done(null, false, { message: 'Incorrect email or password.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
              return done(null, false, { message: 'Incorrect email or password.' });
            }

            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  private serializeUser(): void {
    passport.serializeUser((user: any, done) => {
      done(null, user.email);
    });
  }

  private deserializeUser(): void {
    passport.deserializeUser(async (email: string, done) => {
      try {
        const user = await UserService.findUserByEmail(email);
        done(null, user);
      } catch (err) {
        done(err);
      }
    });
  }

  public initializePassport() {
    return passport.initialize();
  }

  public initializeSession() {
    return passport.session();
  }
}

export const passportConfig = new PassportConfig();
