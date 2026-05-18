import { NavLink } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";

const links = [
  { label: "NEW IN", to: "/new-in" },
  { label: "SHOP", to: "/shop" },
  { label: "COLLECTIONS", to: "/collections" },
  { label: "BLOG", to: "/blog" },
  { label: "ABOUT US", to: "/about" },
];

function Navbar() {
  return (
    <header className="navbar">
      <NavLink className="brand-mark" to="/">
        OWNA ACTIVE
      </NavLink>

      <nav className="nav-links" aria-label="Principal">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        <button className="icon-button" aria-label="Buscar">
          <Search size={18} />
        </button>
        <button className="icon-button" aria-label="Perfil">
          <User size={18} />
        </button>
        <button className="icon-button" aria-label="Carrito">
          <ShoppingCart size={18} />
        </button>
        <span className="currency-label">USD $</span>
      </div>
    </header>
  );
}

export default Navbar;
