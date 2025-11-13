import type { User } from "./user"

export interface AuthState {
  accessToken: string | null
  user: User | null
  loading: boolean

  signUp: (
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>
}
