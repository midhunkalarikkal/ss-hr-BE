declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      MONGODB_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN?: string;
      FRONTEND_URL?: string;
      EMAIL_SERVICE?: string;
      EMAIL_USER?: string;
      EMAIL_PASS?: string;
    }
  }
}

export {};