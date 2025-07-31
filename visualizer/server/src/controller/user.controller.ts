import { Request, Response } from "express";
import { asyncHandler } from "../middleware/async-handler";
import { seedUser as seedUserScript } from "../scripts/seed-user";

const seedUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        await seedUserScript();
        res.status(200).json({ message: 'Demo user created successfully' });
    } catch (error) {
        res.status(200).json({ message: 'Demo user already exists' });
    }
});

export { seedUser };