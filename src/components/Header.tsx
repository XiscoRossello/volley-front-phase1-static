// Global navigation bar. Using NavLink instead of Link gives us the active
// class for free, which the CSS uses to highlight the current section.

import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <p className="brand">Athletics Sports Club</p>

        <nav className="main-nav" aria-label="Main navigation">
          {/* `end` forces an exact match so "/" isn't always active. */}
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/athletes">Athletes</NavLink>
          <NavLink to="/competitions">Competitions</NavLink>
          <NavLink to="/tryouts">Tryout Booking</NavLink>
          <NavLink to="/coaches">Coaches</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
