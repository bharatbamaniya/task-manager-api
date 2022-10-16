import mongoose from "mongoose";

// Connection URI

const connectionURL = process.env.MONGODB_URL;

await mongoose.connect(connectionURL)


