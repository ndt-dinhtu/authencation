
import { useNavigate } from "react-router"
import { Button } from "../ui/button"
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Logout = () => {
    const { signOut } = useAuthStore()
    const navigate = useNavigate();
    const handleLogOut = async () => {
        try {
            await signOut()
            navigate("/signin")

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Đăng xuất thất bại")
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