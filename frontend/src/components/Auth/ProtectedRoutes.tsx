import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoutes = () => {
    const { accessToken, user, loading } = useAuthStore()
    if (!accessToken) {
        return (
            <Navigate to="/signin" replace />
        )
    }
    return (
        <Outlet></Outlet>
    )
}

export default ProtectedRoutes