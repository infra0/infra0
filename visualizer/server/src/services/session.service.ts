import moment from "moment";
import { SessionModel, SessionStatus } from "../model/session.model";
import { Tokens } from "../types/auth.types";
import { AppError } from "../errors/app-error";
import httpStatus from "http-status";

export const createSession = async (sessionId: string) => {
  const expiresAt = moment().add(2, 'minutes');
  const session = await SessionModel.create({ sessionId, expiresAt, status: SessionStatus.IN_PROGRESS });
  return session;
};

export const getSession = async (sessionId: string) => {
  const currentTime = moment();
  const session = await SessionModel.findOne({ sessionId });
  if(!session) {
    throw new AppError("Session not found", httpStatus.NOT_FOUND);
  }
  if(session.expiresAt < currentTime.toDate()) {
    const newSession = await SessionModel.findOneAndUpdate({ sessionId }, { status: SessionStatus.FAILED }, { new: true });
    return newSession;
  }
  return session;
};

export const updateSession = async (sessionId: string, tokens: Tokens) => {
  const currentTime = moment();

  const session_ = await SessionModel.findOne({ sessionId });
  if(!session_) {
    throw new AppError("Session not found", httpStatus.NOT_FOUND);
  }

  if(session_.expiresAt < currentTime.toDate()) {
    const newSession = await SessionModel.findOneAndUpdate({ sessionId }, { tokens, status: SessionStatus.FAILED }, { new: true });
    return newSession;
  }
  const session = await SessionModel.findOneAndUpdate({ sessionId }, { tokens, status: SessionStatus.READY }, { new: true });
  return session;
};

export const deleteSession = async (sessionId: string) => {
    await SessionModel.findOneAndDelete({ sessionId });
}