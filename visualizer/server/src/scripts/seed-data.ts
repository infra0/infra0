import { createUserItem } from "../services/user.service";
import mongoose from "mongoose";
import { config } from "../../config/index";

const seedUser = async () => {
    await createUserItem({
        contact: "+15551234567",
        password: "demo1234",
        firstName: "Demo",
        lastName: "User",
    });

    console.log('Demo user created successfully')
};



const seedData = async () => {
    await mongoose.connect(config.mongoDbUri).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });
    await seedUser();
    await mongoose.disconnect();
}

seedData();