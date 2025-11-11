import { NavLink } from "react-router-dom";
import Button from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import "/src/navBarStyles.css";

library.add(fas, far, fab);

function SubNavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sub-navbar">
      <button
        className="sub-nav-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle sub navigation"
      >
        <FontAwesomeIcon icon={menuOpen ? "times" : "bars"} />
      </button>

      <div className={`sub-nav-links ${menuOpen ? "open" : ""}`}>
        <NavLink to="/documentation" onClick={() => setMenuOpen(false)}>
          <Button className="subnav-wide-btn" value="Documentation" />
        </NavLink>

        <a
          className="github-link"
          href="https://github.com/sybille47/INVESTA/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
          aria-label="View GitHub repository"
        >
          <FontAwesomeIcon icon={["fab", "github"]} className="subnav-bar-icon" />
          <span className="github-text">GitHub</span>
        </a>
      </div>
    </div>
  );
}

export default SubNavBar;