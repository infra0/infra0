import { Request, Response } from "express";
import { asyncHandler } from "../middleware/async-handler";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../types/auth.types";
import { getUserByContact, createUserItem } from "../services/user.service";
import { AppError } from "../errors/app-error";
import httpStatus from "http-status";
import { IUser } from "../model/user.model";
import {
  correctPassword,
  createTokens,
  createAccessToken,
  verifyToken,
} from "../helpers/jwt";
import { Status } from "../types/base";

const refreshTokens = asyncHandler(
  async (
    req: Request<{}, {}, RefreshTokenRequest>,
    res: Response<RefreshTokenResponse>
  ) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", httpStatus.BAD_REQUEST);
    }

    const decoded = verifyToken(refreshToken) as any;

    const newAccessToken = createAccessToken({ id: decoded.id });

    res.status(httpStatus.OK).json({
      status: Status.SUCCESS,
      message: "Token refreshed successfully",
      data: {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: refreshToken,
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
    const tokens = createTokens({ id: user.id });

    res.status(httpStatus.OK).json({
      status: Status.SUCCESS,
      message: "Login successful",
      data: {
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        user,
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

    const tokens = createTokens({ id: user.id });

    res.status(httpStatus.OK).json({
      status: Status.SUCCESS,
      message: "Register successful",
      data: {
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        user,
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

export { login, register, me, refreshTokens };
