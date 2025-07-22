import { AppError } from "../errors/app-error";
import {IUser, UserModel} from "../model/user.model";
import httpStatus from "http-status";

interface CreateUserItemParams {
    firstName: string;
    lastName: string;
    contact: string;
    password: string;
    avatar?: string;
}

export const getUserByContact = async (contact: string): Promise<IUser | null> => {
    const user = await UserModel.findOne({ contact }).select('+password');
    return user;
}

export const getUserById = async (id: string): Promise<IUser | null> => {
    const user = await UserModel.findById(id);
    return user;
}

export async function createUserItem(user: CreateUserItemParams): Promise<IUser> {
    // check if user already exists
    const existingUser = await getUserByContact(user.contact);
    
    if (existingUser) {
    throw new AppError('User already exists', httpStatus.BAD_REQUEST);
    }

    const newUser = await UserModel.create({
        firstName: user.firstName,
        lastName: user.lastName,
        contact: user.contact,
        password: user.password,
        avatar: user.avatar,
    });

    return newUser;
};