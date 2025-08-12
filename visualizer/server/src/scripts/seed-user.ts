import { createUserItem } from "../services/user.service";

export const seedUser = async () => {
    await createUserItem({
        email: "demo@gmail.com",
        password: "demo1234",
        firstName: "Demo",
        lastName: "User",
    });

    console.log('Demo user created successfully')
};
