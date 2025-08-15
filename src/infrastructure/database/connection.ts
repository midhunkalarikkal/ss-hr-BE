import mongoose from 'mongoose';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  
  private constructor() {}
  
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
  
  public async connect(): Promise<void> {
    try {
      const mongoUri = process.env['MONGODB_URI'];
      
      if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }
      
      await mongoose.connect(mongoUri);
      
      console.log('✅ Database connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ Database connection error:', error);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ Database disconnected');
      });
      
      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('🔒 Database connection closed');
        process.exit(0);
      });
      
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }
  
  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}