export {};

declare global {
  namespace Express {
    export interface Request {
      user: AuthUser;
      file: {
        originalname: string;
        buffer: string;
        path: string;
      };
    }
  }

  export interface AuthUser {
    id: string;
    address: string;
  }
}
export interface AuthUser {
  id: string;
  address: string;
}
