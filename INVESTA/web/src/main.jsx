import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.jsx";
import "./index.css";

const redirectUri = window.location.origin;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-3j603j6lo2akvuu6.us.auth0.com"
      clientId="oeQQsquECxpRKZ9gfRfxDP31nX8zGuiD"
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: "https://investa-api",
        scope: "openid profile email"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
