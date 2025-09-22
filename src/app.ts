import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import session from "express-session";
import cookieParser from 'cookie-parser';
import { appConfig } from './config/env';
import passport from './infrastructure/auth/passport';
import authRoutes from './presentation/routes/authRoutes';
import userRoutes from './presentation/routes/userRoutes';
import messageRoutes from './presentation/routes/messageRoutes';
import adminJobRoutes from './presentation/routes/adminJobRoutes';
import adminChatRoutes from './presentation/routes/adminChatRoutes';
import adminUsersRoutes from './presentation/routes/adminUserRoutes';
import adminPaymentRoutes from "./presentation/routes/adminPaymentRoutes";
import adminPackageRoutes from "./presentation/routes/adminPackageRoutes";
import adminSettingsRoutes from './presentation/routes/adminSettingsRoutes';
import adminTestimonialRoutes from './presentation/routes/adminTestimonialRoutes';

const app = express();

if (appConfig.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

const allowedOrigins = [appConfig.frontendUrl];

console.log("allowedOrigins : ",allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
}));

app.use(session({
  secret: appConfig.sessionSecret || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: appConfig.nodeEnv === 'production',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(compression());
app.use(helmet());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());


app.use('/api/auth',authRoutes);

app.use("/api/admin/settings",adminSettingsRoutes);
app.use('/api/admin/jobs',adminJobRoutes);
app.use('/api/admin/chat',adminChatRoutes);
app.use('/api/admin/users',adminUsersRoutes);
app.use("/api/admin/testimonials",adminTestimonialRoutes);
app.use('/api/admin/packages', adminPackageRoutes);
app.use('/api/admin/payments', adminPaymentRoutes);

app.use('/api/message',messageRoutes);

app.use('/api/user',userRoutes);

export default app;