
import { useNavigate } from "react-router"
import { Button } from "../ui/button"
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut } from "lucide-react";

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
        <Button variant="completeGhost" onClick={handleLogOut}>
            <LogOut className="text-destructive"/>
            Loggout
        </Button>
    )
}

export default Logout