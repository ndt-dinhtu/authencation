import Logout from "@/components/Auth/logout"
import { useAuthStore } from "@/stores/useAuthStore"

const ChatAppPage = () => {
  const user=useAuthStore((s)=>s.user)
  console.log(user)
  return (
    <div>
      {user?.username}
      <Logout />
    </div>
  )
}

export default ChatAppPage