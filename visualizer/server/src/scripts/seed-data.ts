import mongoose from "mongoose";
import { config } from "../../config/index";
import { seedUser } from "./seed-user";


export const seedData = async () => {
    await mongoose.connect(config.mongoDbUri).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });
    await seedUser();
    await mongoose.disconnect();
}

seedData();