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
import messageRoutes from './presentation/routes/messageRoutes';

import adminJobRoutes from './presentation/routes/adminJobRoutes';
import adminChatRoutes from './presentation/routes/adminChatRoutes';
import adminSettingsRoutes from './presentation/routes/adminSettingsRoutes';
import { adminUsersRoutes } from './presentation/routes/userRoutes';

import userChatRoutes from './presentation/routes/userChatRoutes';

const app = express();

if (appConfig.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

const allowedOrigins = [
  "http://localhost:3000",
  "https://ss-hr-c-fe-fucg.vercel.app"
];

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
  secret: process.env.SESSION_SECRET || 'mySecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
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
app.use('/api/user/chat',userChatRoutes);
app.use('/api/message',messageRoutes);

export default app;