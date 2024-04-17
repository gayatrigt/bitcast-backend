import { User } from "./src/schemas";

declare global {
  namespace Express {
    export interface Request {
      user: AuthUser;
    }
  }
}

export interface AuthUser {
  id: string;
  address: string;
}
