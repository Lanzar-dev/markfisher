import "./App.css";
import { Login } from "./Auths/Login";
import { SignUp } from "./Auths/SignUp";
import * as routes from "./Data/Routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.login} index element={<Login />} />
        <Route path={routes.signup} index element={<SignUp />} />
        <Route path={routes.homepage} index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
