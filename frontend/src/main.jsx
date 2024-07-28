import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthStateWrapper } from "../context/Auth.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthStateWrapper>
      <App />
    </AuthStateWrapper>
  </BrowserRouter>
);
