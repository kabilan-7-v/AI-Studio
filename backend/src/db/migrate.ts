import { connectDB } from './connection';

const runMigrations = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // With MongoDB/Mongoose, schemas are automatically created
    // when models are first used. No manual migration needed.
    console.log('MongoDB connection established - schemas will be created automatically');
  } catch (error) {
    console.error('Error during MongoDB setup:', error);
    throw error;
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Database setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

export default runMigrations;
