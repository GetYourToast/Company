import app from './app.js';
import config from './config/config.js';
import connectDB from './config/database.js';
import { startScheduler } from './services/scheduler.js';
import { checkEnvironment } from './utils/envCheck.js';

const startServer = async () => {
  try {
    if (!checkEnvironment()) {
      process.exit(1);
    }

    await connectDB();
    
    startScheduler();
    
    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    const gracefulShutdown = () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();