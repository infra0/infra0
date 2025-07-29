// middleware to verify token

import { Request, Response, NextFunction } from "express";
import { extractAuthToken, verifyToken as verifyTokenHelper } from "../helpers/jwt";
import { getUserById } from "../services/user.service";
import { asyncHandler } from "./async-handler";
import { IUser } from "../model/user.model";


export const verifyToken = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractAuthToken(req.headers.authorization || '');
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = verifyTokenHelper(token);
  const user = await getUserById(decoded.sub);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user as IUser;
  next();
});