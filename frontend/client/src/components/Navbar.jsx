import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="app-navbar">
      <div className="nav-container">

        {/* LOGO */}
        <NavLink className="nav-brand" to="/">
          <span>📊</span> MediaIntel
        </NavLink>

        {/* LINKS */}
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/rules"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Rules
          </NavLink>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
