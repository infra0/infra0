// middleware to verify token

import { Request, Response, NextFunction } from "express";
import { verifyToken as verifyTokenHelper } from "../helpers/jwt";
import { getUserById } from "../services/user.service";
import { asyncHandler } from "./async-handler";
import { IUser } from "../model/user.model";


export const verifyToken = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = verifyTokenHelper(token) as { id: string };
  const user = await getUserById(decoded.id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user as IUser;
  next();
});