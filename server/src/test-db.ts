
import { db } from "./config/database";

async function testDatabase() {
    try {
        console.log("Connecting to PostgreSQL...");

        await db.connect();

        console.log("SUCCESS: PostgreSQL connected successfully!");
        const dbName = process.env.DATABASE_URL
            ? new URL(process.env.DATABASE_URL).pathname.slice(1)
            : "Unknown";
        console.log(`Database: ${dbName}`);

    } catch (error) {
        console.error("FAILED: Database connection error!");

        if (error instanceof Error) {
            console.error(error.message);
        }

        process.exitCode = 1;
    } finally {
        await db.close();
    }
}

testDatabase();
