import { Request, Response } from "express";
import { asyncHandler } from "../middleware/async-handler";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  JWT_PAYLOAD_TYPE,
} from "../types/auth.types";
import { getUserByContact, createUserItem } from "../services/user.service";
import { AppError } from "../errors/app-error";
import httpStatus from "http-status";
import { IUser } from "../model/user.model";
import {
  correctPassword,
  verifyToken,
  generateOnlyAccessToken,
  generateAuthTokens,
} from "../helpers/jwt";
import { Status } from "../types/base";
import { extractAuthToken } from "../helpers/jwt";

const refreshToken = asyncHandler(
  async (
    req: Request<{}, {}, RefreshTokenRequest>,
    res: Response<RefreshTokenResponse>
  ) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", httpStatus.BAD_REQUEST);
    }

    const decoded = verifyToken(refreshToken) as JWT_PAYLOAD_TYPE;

    const newAccessToken = await generateOnlyAccessToken({ id: decoded.sub });

    res.status(httpStatus.OK).json({
      status: Status.SUCCESS,
      message: "Token refreshed successfully",
      data: {
        tokens: {
          access: newAccessToken.access,
          refresh: {
            token: refreshToken,
            expires: new Date(decoded.exp * 1000),
          },
        },
      },
    });
  }
);

const login = asyncHandler(
  async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse>) => {
    const { contact, password } = req.body;
    const user: IUser | null = await getUserByContact(contact);
    if (!user) {
      throw new AppError("User not found", httpStatus.NOT_FOUND);
    }
    // Here the user.password is hashed and password is not hashed
    const isPasswordCorrect = await correctPassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Invalid password", httpStatus.UNAUTHORIZED);
    }

    // Generate both tokens
    const tokens = await generateAuthTokens({ id: user.id });

    res.status(httpStatus.OK).json({
      status: Status.SUCCESS,
      message: "Login successful",
      data: {
        user,
        tokens
      },
    });
  }
);

const register = asyncHandler(
  async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response<RegisterResponse>
  ) => {
    const { contact, password, firstName, lastName } = req.body;
    const user: IUser = await createUserItem({
      contact,
      password,
      firstName,
      lastName,
    });

    const tokens = await generateAuthTokens({ id: user.id });

    res.status(httpStatus.OK).json({
      status: Status.SUCCESS,
      message: "Register successful",
      data: {
        user,
        tokens
      },
    });
  }
);

const me = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  res.status(httpStatus.OK).json({
    status: Status.SUCCESS,
    message: "Me",
    data: user as IUser,
  });
});

const validateAccessToken = asyncHandler(async (req: Request, res: Response<boolean>) => { 
  const authToken = extractAuthToken(req.headers.authorization || '')
  if (!authToken) {
    throw new AppError("Please authenticate", httpStatus.UNAUTHORIZED)
  }
  const isValidated = verifyToken(authToken)
  if (!isValidated) {
    throw new AppError("Invalid token", httpStatus.UNAUTHORIZED)
  }
  res.status(httpStatus.OK).json(isValidated ? true : false)

});

export { login, register, me, refreshToken, validateAccessToken };
