import { DuplicateResourceError } from "../errors/app-error";
import {IUser, UserModel} from "../model/user.model";
import httpStatus from "http-status";

interface CreateUserItemParams {
    firstName: string;
    lastName: string
    password: string;
    avatar?: string;
    email: string;
    provider?: string;
    isEmailVerified?: boolean;
}

export const getUserById = async (id: string): Promise<IUser | null> => {
    const user = await UserModel.findById(id);
    return user;
}

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    const user = await UserModel.findOne({ email }).select('+password');
    return user;
}

export async function createUserItem(user: CreateUserItemParams): Promise<IUser> {
    // check if user already exists by email
    const existingUserByEmail = await getUserByEmail(user.email);
    
    if (existingUserByEmail) {
        throw new DuplicateResourceError();
    }

    const newUser = await UserModel.create({
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        avatar: user.avatar,
        email: user.email,
        provider: user.provider || 'email',
        isEmailVerified: user.isEmailVerified || false,
    });

    return newUser;
};