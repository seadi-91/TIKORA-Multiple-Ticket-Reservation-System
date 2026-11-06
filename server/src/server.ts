import { db } from "./config/database";

async function startServer() {
    try {
        await db.connect();

        console.log("PostgreSQL connected successfully!");

        // Start your Express server here.
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

startServer();