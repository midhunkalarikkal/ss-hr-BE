import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { DatabaseConnection } from './infrastructure/database/connection';
import authRoutes  from './presentation/routes/authRoutes';
dotenv.config({quiet:true});

const app = express();
const port = parseInt(process.env['PORT'] || '5000');
const database = DatabaseConnection.getInstance();


app.use(helmet());


app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  credentials: true
}));


app.use(compression());


if (process.env['NODE_ENV'] === 'development') {
  app.use(morgan('dev'));
}


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SS HR Backend API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV']
  });
});


app.use('/api/auth', authRoutes);

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


app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Global Error:', error);
  
  res.status(500).json({
    success: false,
    message: process.env['NODE_ENV'] === 'development' ? error.message : 'Internal server error'
  });
});


async function startServer() {
  try {

    await database.connect();
    

    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();