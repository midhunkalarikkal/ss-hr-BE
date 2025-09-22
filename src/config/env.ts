import dotenv from 'dotenv';
dotenv.config();

export const mongoConfig = {
    mongoURL: process.env.NODE_ENV === "development" ? process.env.MONGODB_LOCAL_URI : process.env.MONGODB_PRODUCTION_URI,
}

export const mailConfig = {
    user: process.env.OFFICIAL_EMAIL,
    password: process.env.OFFICIALEMAIL_PASS
}

export const jwtConfig = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
}

export const appConfig = {
    sessionSecret: process.env.SESSION_SECRET,
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    frontendUrl: process.env.NODE_ENV === "development" ? process.env.FRONTEND_BASE_URL : process.env.FRONTEND_PRODUCTION_URL
}

export const adminConfig = {
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD
}

export const aws_s3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
}

export const redisConfig = {
    redisUrl: process.env.REDIS_URL,
    redisToken: process.env.REDIS_TOKEN
}

export const googleClientConfig = {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackURL: appConfig.nodeEnv === 'development' ? process.env.GOOGLE_CALLBACK_LOCAL_URL : process.env.GOOGLE_CALLBACK_PRODUCTION_URL,
}


console.log("frontendUrl : ",appConfig.frontendUrl);