import "./App.css";
import { Login } from "./Auths/Login";
import { SignUp } from "./Auths/SignUp";
import * as routes from "./Data/Routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home/Home";
import { ForgotPassword } from "./Auths/ForgotPassword";
import { useAppSelector } from "./Store/store";
import { Notification } from "./Components/Notification";
import { Loader } from "./Components/Loader";
import { ResetPassword } from "./Auths/ResetPassword";

function App() {
  const { isNotify, isLoading } = useAppSelector((state) => state.user);

  return (
    <BrowserRouter>
      {isNotify && <Notification />}
      {isLoading && <Loader />}
      <Routes>
        <Route path={routes.login} index element={<Login />} />
        <Route path={routes.signup} index element={<SignUp />} />
        <Route path={routes.homepage} index element={<Home />} />
        <Route path={routes.f_password} index element={<ForgotPassword />} />
        <Route path={routes.r_password} index element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
