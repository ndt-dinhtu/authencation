import Logout from "@/components/Auth/logout"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/axios"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user)
  console.log(user)
  const handleTest = async () => {
    try {
      await api.get("/users/test", { withCredentials: true })
      console.log("thanh cong")
      toast.success("Thanh cong")
    } catch (error) {
      console.error(error)
      toast.error("That bai")
    }
  }
  return (
    <div>
      {user?.username}
      <Logout />
      <Button onClick={handleTest}>Test</Button>
    </div>
  )
}

export default ChatAppPage