import { v4 as uuidv4 } from 'uuid';

export const generateShortSessionId = () => {
  return uuidv4().slice(0, 8);
};