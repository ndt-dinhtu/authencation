
import { useNavigate } from "react-router"
import { Button } from "../ui/button"
import { useAuthStore } from "@/stores/useAuthStore";

const Logout = () => {
    const { signOut } = useAuthStore()
    const navigate = useNavigate();
    const handleLogOut = async () => {
        try {
            await signOut()
            navigate("/signin")

        } catch (error) {
            console.error(error )
        }
    }
    return (
        <Button onClick={handleLogOut}>
            Loggout
        </Button>
    )
}

export default Logout