import app from "./app";
import { db } from "./config/database";
import { ENV } from "./config/environment";

async function startServer() {
  try {
    console.log("Connecting to PostgreSQL database...");
    await db.connect();
    console.log("Database connected successfully.");

    // Ensure default system roles exist
    const defaultRoles = [
      { name: "CUSTOMER", description: "Standard ticket buyer" },
      { name: "ORGANIZATION", description: "Provider and operator administrator" },
      { name: "INSPECTOR", description: "Ticket inspector and gate scanner" },
      { name: "ADMIN", description: "Platform super administrator" },
    ];

    for (const r of defaultRoles) {
      const existing = await db.orm.public.Role.where({ name: r.name }).first();
      if (!existing) {
        await db.orm.public.Role.create({
          name: r.name,
          description: r.description,
        });
        console.log(`Initialized default role: ${r.name}`);
      }
    }

    const server = app.listen(ENV.PORT, () => {
      console.log(`TIKORA Backend Server running at http://localhost:${ENV.PORT}`);
      console.log(`Client URL allowed: ${ENV.CLIENT_URL}`);
      console.log(`Google OAuth Callback: ${ENV.GOOGLE_CALLBACK_URL}`);
      console.log(`GitHub OAuth Callback: ${ENV.GITHUB_CALLBACK_URL}`);
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}. Shutting down server gracefully...`);
      server.close(async () => {
        try {
          await db.close();
          console.log("Database connection closed.");
          process.exit(0);
        } catch (err) {
          console.error("Error closing database:", err);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start backend server:", error);
    process.exit(1);
  }
}

startServer();
