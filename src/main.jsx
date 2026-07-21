import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./i18n.js";
import i18n from "./i18n.js";
import "./index.css";

// Handle RTL layout for Urdu
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ur' ? 'rtl' : 'ltr';
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);