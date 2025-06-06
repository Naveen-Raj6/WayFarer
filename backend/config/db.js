import mongoose from "mongoose";


async function db() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // console.log("✅ Connected to MongoDB");
        console.log("✅ Connected to MongoDB Atlas");
    } catch (error) {
        console.log("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
}

export default db;