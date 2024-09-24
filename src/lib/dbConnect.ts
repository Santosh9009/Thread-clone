import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable inside .env.local");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);

    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1); // Exit the process with failure
  }
}

export default dbConnect;
