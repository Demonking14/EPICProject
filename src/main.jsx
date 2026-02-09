import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { initializeDemoUsers } from "./utils/auth";
import "./i18n";
import "./index.css";

// Initialize demo users when app starts
initializeDemoUsers();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
