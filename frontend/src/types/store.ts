
import type { User } from "./user"

export interface AuthState {
  accessToken: string | null
  user: User | null
  loading: boolean

  clearState: () => void

  setAccessToken: (accessToken: string) => void

  signUp: (
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>

  signIn: (username: string, password: string) => Promise<void>

  signOut: () => Promise<void>

  fetchMe: () => Promise<void>

  refresh: () => Promise<void>
}

export interface themeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}