import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner"
import SignInPage from "./assets/pages/SignInPage"
import SignUpPage from "./assets/pages/SignUpPage";
import ChatAppPage from "./assets/pages/ChatAppPage";
function App() {

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignInPage/>} />
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/" element={<ChatAppPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
