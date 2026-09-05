import "dotenv/config";
import app from './app.ts'
import { connectToDatabase } from "./config/database.ts";

const PORT = 3000;

async function startServer() {
    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
}

startServer();
