import type { User } from "./Post.interface";

export type LoginData = {
  nickName: string;
  password: string;
};

export type UsuarioContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => void;
};