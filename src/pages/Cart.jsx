import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { formatCurrency } from "../lib/shop-utils";

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    checkoutProfile,
    saveCartLead,
    updateCartQuantity,
    removeFromCart,
    startCheckout,
  } = useShop();

  function handleCheckout() {
    startCheckout();
    navigate("/checkout");
  }

  return (
    <main className="commerce-layout">
      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Checkout funnel</p>
          <h1>Tu carrito</h1>
          <p className="section-description">
            Revisa tus articulos y deja tu email para activar la recuperacion de
            carrito si interrumpes la compra.
          </p>
        </div>

        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.length ? (
              cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-copy">
                    <h3>{item.name}</h3>
                    <p>{formatCurrency(item.price)}</p>
                  </div>
                  <input
                    className="cart-qty"
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(event) =>
                      updateCartQuantity(item.id, event.target.value)
                    }
                  />
                  <button
                    className="text-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Eliminar
                  </button>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <p>No hay productos en el carrito todavia.</p>
                <Link className="primary-button" to="/shop">
                  Ir a comprar
                </Link>
              </div>
            )}
          </div>

          <aside className="summary-card">
            <h2>Resumen</h2>
            <div className="summary-row">
              <span>Total</span>
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>

            <div className="lead-capture">
              <label>
                Nombre
                <input
                  value={checkoutProfile.name}
                  onChange={(event) => saveCartLead({ name: event.target.value })}
                  placeholder="Tu nombre"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={checkoutProfile.email}
                  onChange={(event) => saveCartLead({ email: event.target.value })}
                  placeholder="correo@ejemplo.com"
                />
              </label>
            </div>

            <button
              className="primary-button"
              onClick={handleCheckout}
              disabled={!cartItems.length}
            >
              Iniciar checkout
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Cart;
