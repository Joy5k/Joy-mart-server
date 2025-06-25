import { Server } from "http";
import mongoose from "mongoose";
import app from "./mainApp";
import config from "./app/config";
import seedSuperAdmin from "./app/DB";

let server: Server;

async function main() {
  try {
    // Database connection with better options
    await mongoose.connect(config.database_url as string, {
    });

    console.log("✅ Database connected successfully");

    // Seed super admin if needed (consider adding error handling)
    await seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`✅ Server is listening on port ${config.port}`);
      console.log(`🚀 Visit: http://localhost:${config.port}`);
    });

    // Enable graceful shutdown
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // Exit with failure code
  }
}

// Graceful shutdown handler
function gracefulShutdown() {
  console.log('🛑 Received shutdown signal, closing server...');
  
  server?.close(async () => {
    console.log('🔒 Server closed');
    
    try {
      await mongoose.disconnect();
      console.log('🔒 Database connection closed');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during database disconnection:', err);
      process.exit(1);
    }
  });

  // Force close after timeout
  setTimeout(() => {
    console.error('⏰ Force shutdown after timeout');
    process.exit(1);
  }, 5000); // 5 seconds timeout
}

// Error handlers
process.on("unhandledRejection", (reason: Error | any) => {
  console.error(`😈 Unhandled Rejection at: ${reason?.stack || reason}`);
  gracefulShutdown();
});

process.on("uncaughtException", (error: Error) => {
  console.error(`😈 Uncaught Exception: ${error.stack}`);
  gracefulShutdown();
});

main();