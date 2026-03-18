import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <p className="brand">Athletics Sports Club</p>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/athletes">Athletes</NavLink>
          <NavLink to="/tryouts">Tryout Booking</NavLink>
          <NavLink to="/coaches">Coaches</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
