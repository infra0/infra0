import { createUserItem } from "../services/user.service";

export const seedUser = async () => {
    await createUserItem({
        contact: "+15551234567",
        password: "demo1234",
        firstName: "Demo",
        lastName: "User",
    });

    console.log('Demo user created successfully')
};
