import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import investaLogo from "./assets/investaLogoDark.png";
import { NavContainer } from "../ui/NavBar";
import "/src/navBarStyles.css";

library.add(fas, far, fab);


function TopNav() {
  const { isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.stopPropagation();
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleLogoClick = () => {
    navigate(isAuthenticated ? "/funds" : "/");
  };

  return (
    <NavContainer className="nav-top-nav">
      <div className="nav-section nav-left">
        <div
          className="logo-container"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
        >
          <img src={investaLogo} alt="Investa Logo" className="nav-logo" />
        </div>
      </div>

      <div className="nav-section nav-center">
        <div className="nav-links">
          <NavLink
            to="/funds"
            className={({ isActive }) => `nav-link-btn ${isActive ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={["fas", "home"]} className="nav-icon" />
            <span>Funds</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) => `nav-link-btn ${isActive ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={["fas", "history"]} className="nav-icon" />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/placeOrder"
            className={({ isActive }) => `nav-link-btn ${isActive ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={["fas", "plus-circle"]} className="nav-icon" />
            <span>New Order</span>
          </NavLink>

          <NavLink
            to="/charts"
            className={({ isActive }) => `nav-link-btn ${isActive ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={["fas", "chart-simple"]} className="nav-icon" />
            <span>Analytics</span>
          </NavLink>

          <NavLink
            to="/documentation"
            className={({ isActive }) => `nav-link-btn ${isActive ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={["fas", "book"]} className="nav-icon" />
            <span>Project Documentation</span>
          </NavLink>

          <NavLink
            to="https://github.com/sybille47/INVESTA/blob/main/README.md"
            target="_blank"
            className={({ isActive }) => `nav-link-btn ${isActive ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={["fab", "github"]} className="nav-icon" />
            <span>Github</span>
          </NavLink>

        </div>
      </div>

      <div className="nav-section nav-right">
        <NavLink
          to="/profile"
          className={({ isActive }) => `profile-btn ${isActive ? "active" : ""}`}
          title="Profile"
        >
          <FontAwesomeIcon icon={["fas", "user"]} className="profile-icon" />
        </NavLink>

        <div className="nav-divider"></div>

        <button className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={["fas", "sign-out-alt"]} className="logout-icon" />
          <span>Log Out</span>
        </button>
      </div>
    </NavContainer>
  );
}

export default React.memo(TopNav);