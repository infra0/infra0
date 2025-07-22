import { Request, Response } from "express";
import { asyncHandler } from "../middleware/async-handler";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth.types";
import { getUserByContact, createUserItem } from "../services/user.service";
import { AppError } from "../errors/app-error";
import httpStatus from "http-status";
import { IUser } from "../model/user.model";
import { correctPassword, createToken } from "../helpers/jwt";
import { Status } from "../types/base";


const login = asyncHandler(async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse>) => {
    const { contact, password } = req.body;
    const user: IUser | null = await getUserByContact(contact);
    if (!user) {
        throw new AppError('User not found', httpStatus.NOT_FOUND);
    }
    // Here the user.password is hashed and password is not hashed
    const isPasswordCorrect = await correctPassword(password, user.password);
    if (!isPasswordCorrect) {
        throw new AppError('Invalid password', httpStatus.UNAUTHORIZED);
    }
    const token = createToken({ id: user.id });
    res.status(httpStatus.OK).json({ status: Status.SUCCESS, message: 'Login successful', data: { token, user } });
    
});

const register = asyncHandler(async (req: Request<{}, {}, RegisterRequest>, res: Response<RegisterResponse>) => {
    const { contact, password, firstName, lastName } = req.body;
    const user: IUser = await createUserItem({ contact, password, firstName, lastName });
    const token = createToken({ id: user.id });
    res.status(httpStatus.OK).json({ status: Status.SUCCESS, message: 'Register successful', data: { token, user } });
});


const me = asyncHandler(async (req: Request, res: Response) => {    
    const user = req.user;
    res.status(httpStatus.OK).json({ 
        status: Status.SUCCESS, 
        message: 'Me', 
        data: user as IUser
    });
});

export { login, register, me };