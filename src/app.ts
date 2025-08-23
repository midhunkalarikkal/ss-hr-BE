import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import authRoutes from './presentation/routes/authRoutes';
// import userRouter from './interface/user/user.routes';
// import adminRoutes from './interface/admin/admin.routes';
// import providerRouter from './interface/provider/provider.router';

dotenv.config();

const app = express();

if (process.env['NODE_ENV'] === 'development') {
  app.use(morgan('dev'));
}

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
}));

app.use(compression());
app.use(helmet());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',authRoutes);
// app.use('/api/user',userRouter);
// app.use("/api/admin",adminRoutes);
// app.use('/api/provider',providerRouter);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SS HR Backend API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV']
  });
});



app.get('/api', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SS HR Consultancy API v1.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        verify: 'GET /api/auth/verify'
      }
    }
  });
});

export default app;