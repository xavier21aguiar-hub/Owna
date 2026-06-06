import { Link } from "react-router-dom";
import { readStorage } from "../lib/storage";
import { STORAGE_KEYS, formatCurrency } from "../lib/shop-utils";

function Confirmation() {
  const order = readStorage(STORAGE_KEYS.latestOrder, null);

  return (
    <main className="confirmation-page">
      <section className="summary-card confirmation-card">
        <p className="eyebrow">Compra finalizada</p>
        <h1>Gracias por comprar en OWNA</h1>
        {order ? (
          <>
            <p className="section-description">
              Pedido {order.id} registrado para {order.email || order.name || "cliente"}.
            </p>
            <div className="summary-row summary-total">
              <span>Total pagado</span>
              <strong>{formatCurrency(order.total)}</strong>
            </div>
          </>
        ) : (
          <p className="section-description">
            No encontramos un pedido reciente en esta sesion.
          </p>
        )}
        <div className="product-action-row">
          <Link className="primary-button" to="/shop">
            Seguir comprando
          </Link>
          <Link className="secondary-button" to="/admin">
            Ver panel admin
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Confirmation;
