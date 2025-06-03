import { Server } from "http";
import mongoose from "mongoose";
import app from "./mainApp";
import config from "./app/config";
import seedSuperAdmin from "./app/DB";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string, {
    });

    seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`✅ App is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log("❌ Database connection failed:", err);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log(`😈 unhandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
