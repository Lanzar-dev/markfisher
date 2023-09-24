import "./App.css";
import { Login } from "./Auths/Login";
import * as routes from "./Data/Routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.homepage} index element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
