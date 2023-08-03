import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// Render the app to the root element
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
        <App />
  </BrowserRouter>
);
