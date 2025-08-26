import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Types } from 'mongoose';
import { googleClientConfig, appConfig } from '../../config/env';
import { UserRepositoryImpl } from '../database/user/userRepositoryImpl';

const userRepository = new UserRepositoryImpl();


if (!googleClientConfig.googleClientId || !googleClientConfig.googleClientSecret) {
  console.warn('Google OAuth credentials not found. Google SSO will be disabled.');
} else {
  passport.use(new GoogleStrategy({
    clientID: googleClientConfig.googleClientId,
    clientSecret: googleClientConfig.googleClientSecret,
    callbackURL: `${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.BACKEND_URL}/api/auth/google/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await userRepository.findUserByGoogleId(profile.id);
      
      if (existingUser) {
        return done(null, existingUser);
      }

      const emailUser = await userRepository.findUserByEmail(profile.emails?.[0]?.value || '');
      
      if (emailUser) {
        emailUser.googleId = profile.id;
        await userRepository.updateUser(emailUser);
        return done(null, emailUser);
      }

      const newUser = await userRepository.createUser({
        googleId: profile.id,
        fullName: profile.displayName || '',
        email: profile.emails?.[0]?.value || '',
        password: '',
        profileImage: profile.photos?.[0]?.value || '',
        role: 'user',
        isVerified: true,
        verificationToken: '',
        phoneOne: '',
        phoneTwo: '',
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, undefined);
    }
  }));
}

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userRepository.findUserById(new Types.ObjectId(id));
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;