import {api} from "../lib/axios"

export const authService = {
    signUp: async (
        firstname: string,
        lastname: string,
        username: string,
        email: string,
        password: string
    ) => {
        const res = await api.post(
            "/auth/signup",
            {
                firstName:firstname,
                lastName:lastname,
                username,
                email,
                password
            },
            { withCredentials: true }
        )

        return res.data
    },
}
