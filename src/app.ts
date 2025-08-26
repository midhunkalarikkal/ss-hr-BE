import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from "express-session"
import authRoutes from './presentation/routes/authRoutes';
import { appConfig } from './config/env';
// import userRouter from './interface/user/user.routes';
// import adminRoutes from './interface/admin/admin.routes';
// import providerRouter from './interface/provider/provider.router';
import passport from './infrastructure/auth/passport';


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
// app.use('/api/user',userRouter);
// app.use("/api/admin",adminRoutes);
// app.use('/api/provider',providerRouter);

// app.get('/api/health', (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'SS HR Backend API is running!',
//     timestamp: new Date().toISOString(),
//     environment: appConfig.nodeEnv
//   });
// });





// app.get('/api', (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'SS HR Consultancy API v1.0',
//     endpoints: {
//       health: '/api/health',
//       auth: {
//         register: 'POST /api/auth/register',
//         login: 'POST /api/auth/login',
//         logout: 'POST /api/auth/logout',
//         verify: 'GET /api/auth/verify'
//       }
//     }
//   });
//   console.log("sended")
// });

export default app;