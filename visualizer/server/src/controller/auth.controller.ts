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
  SessionResponse,
  SessionStatusRequest,
} from "../types/auth.types";
import { createUserItem } from "../services/user.service";
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
import { authService } from "../services/auth.service";
import * as sessionService from "../services/session.service";
import { generateShortSessionId } from "../helpers/auth";
import { SessionStatus } from "../model/session.model";


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

// New unified login that supports OAuth
const login = asyncHandler(
  async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse>) => {
    const { provider, metaData } = req.body;
    const sessionId = metaData?.sessionId;
    try {
      const user = await authService.authenticate(provider, metaData);
      
      // Generate both tokens
      const tokens = await generateAuthTokens({ id: user.id });
      if(sessionId) await sessionService.updateSession(sessionId, tokens);

      res.status(httpStatus.OK).json({
        status: Status.SUCCESS,
        message: "Login successful",
        data: {
          user,
          tokens
        },
      });
    } catch (error: any) {
      throw new AppError(error.message, httpStatus.UNAUTHORIZED);
    }
  }
);


const register = asyncHandler(
  async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response<RegisterResponse>
  ) => {
    const { email, password, firstName, lastName } = req.body;
    const user: IUser = await createUserItem({
      email,
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


const createSession = asyncHandler(async (req: Request, res: Response<SessionResponse>) => {
  const sessionId = generateShortSessionId();
  const session = await sessionService.createSession(sessionId);
  res.status(httpStatus.OK).json({
    data: session,
    status: Status.SUCCESS,
    message: "Session created successfully"
  });
});

const getSessionStatus = asyncHandler(async (req: Request<{}, {}, SessionStatusRequest>, res: Response<SessionResponse>) => {
  const { sessionId } = req.body;
  const session = await sessionService.getSession(sessionId);

  if(session.status === SessionStatus.READY || session.tokens) {
    await sessionService.deleteSession(sessionId);
  }
  
  res.status(httpStatus.OK).json({
    data: session,
    status: Status.SUCCESS,
    message: "Session status fetched successfully"
  });
});


export { login, register, me, refreshToken, validateAccessToken, createSession, getSessionStatus };
