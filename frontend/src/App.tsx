import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import ProtectedRoutes from "./components/Auth/ProtectedRoutes";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
function App() {

  const { isDark, setTheme } = useThemeStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark])

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<ChatAppPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
