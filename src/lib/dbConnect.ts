import mongoose from "mongoose";

type connectionObject = {
  isConnect?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if(connection.isConnect){
    console.log("Already connected to database")
    return;
  } 

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnect = db.connections[0].readyState;
    console.log("db connected successfully");

  } catch (error) {
    console.log("db connection failed",error);
    process.exit();
  }
}

export default dbConnect;