import { NavLink, Link } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { useShop } from "../context/ShopContext";

const links = [
  { label: "NEW IN", to: "/new-in" },
  { label: "SHOP", to: "/shop" },
  { label: "COLLECTIONS", to: "/collections" },
  { label: "BLOG", to: "/blog" },
  { label: "ABOUT US", to: "/about" },
  { label: "ADMIN", to: "/admin" },
];

function Navbar() {
  const { cartItems } = useShop();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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
        <Link className="icon-button cart-button" to="/cart" aria-label="Carrito">
          <ShoppingCart size={18} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        <span className="currency-label">USD $</span>
      </div>
    </header>
  );
}

export default Navbar;
