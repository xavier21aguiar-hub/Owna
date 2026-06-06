import FunnelInsights from "../components/FunnelInsights";
import { useShop } from "../context/ShopContext";
import { formatCurrency } from "../lib/shop-utils";

function countEvents(events, eventName) {
  return events.filter((event) => event.event === eventName).length;
}

function AdminDashboard() {
  const {
    analyticsEvents,
    abandonedCarts,
    emailLogs,
    markEmailOpened,
    clearDemoData,
    simulateAbandonmentNow,
    accelerateEmailSequence,
    processRecoveryEmails,
  } = useShop();

  const metrics = {
    productViews: countEvents(analyticsEvents, "product_viewed"),
    addToCart: countEvents(analyticsEvents, "product_added_to_cart"),
    checkoutStarted: countEvents(analyticsEvents, "checkout_started"),
    shippingCompleted: countEvents(analyticsEvents, "shipping_info_completed"),
    paymentCompleted: countEvents(analyticsEvents, "payment_info_completed"),
    purchases: countEvents(analyticsEvents, "purchase_completed"),
    abandoned: abandonedCarts.length,
    emailsSent: emailLogs.length,
    emailsOpened: emailLogs.filter((log) => log.openedAt).length,
    recovered: abandonedCarts.filter((cart) => cart.recoveredAt).length,
  };

  const recoveryRate = metrics.abandoned
    ? `${Math.round((metrics.recovered / metrics.abandoned) * 100)}%`
    : "0%";

  return (
    <main className="admin-page">
      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">OWNA analytics</p>
          <h1>Panel de metricas</h1>
          <p className="section-description">
            Este panel resume el funnel, los carritos abandonados y los correos
            de recuperacion generados por la demo.
          </p>
        </div>

        <div className="metrics-grid">
          <article className="metric-card">
            <span className="metric-label">Carritos abandonados</span>
            <strong className="metric-value">{metrics.abandoned}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">Emails enviados</span>
            <strong className="metric-value">{metrics.emailsSent}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">Emails abiertos</span>
            <strong className="metric-value">{metrics.emailsOpened}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">Tasa de recuperacion</span>
            <strong className="metric-value">{recoveryRate}</strong>
          </article>
        </div>

        <FunnelInsights metrics={metrics} />

        <div className="admin-columns">
          <section className="summary-card">
            <h2>Recovery</h2>
            <div className="summary-row">
              <span>Inicio de checkout</span>
              <strong>{metrics.checkoutStarted}</strong>
            </div>
            <div className="summary-row">
              <span>Informacion de envio completada</span>
              <strong>{metrics.shippingCompleted}</strong>
            </div>
            <div className="summary-row">
              <span>Informacion de pago completada</span>
              <strong>{metrics.paymentCompleted}</strong>
            </div>
            <div className="summary-row">
              <span>Compras completadas</span>
              <strong>{metrics.purchases}</strong>
            </div>
            <div className="summary-row">
              <span>Carritos recuperados</span>
              <strong>{metrics.recovered}</strong>
            </div>
          </section>

          <section className="summary-card">
            <h2>Microsoft Clarity</h2>
            <p className="section-description">
              Configura `VITE_CLARITY_PROJECT_ID` para activar grabaciones,
              heatmaps, clics y scroll en todas las paginas.
            </p>
            <p className="section-description">
              Luego revisa el archivo de documentacion incluido para el reporte
              academico y para ubicar Project ID, heatmaps y recordings.
            </p>
          </section>
        </div>

        <section className="admin-columns">
          <div className="summary-card">
            <h2>Tabla AbandonedCart</h2>
            {abandonedCarts.length ? (
              abandonedCarts.map((cart) => (
                <article className="data-card" key={cart.id}>
                  <strong>{cart.email || "Sin email capturado"}</strong>
                  <p>{cart.name || "Cliente anonimo"}</p>
                  <p>{cart.products.map((item) => item.name).join(", ")}</p>
                  <p>Total: {formatCurrency(cart.total)}</p>
                  <p>Abandonado: {cart.abandonedAt}</p>
                  <p>
                    Estado: {cart.recoveredAt ? "Recuperado" : "Pendiente"}
                  </p>
                </article>
              ))
            ) : (
              <p className="section-description">
                Aun no hay carritos abandonados detectados.
              </p>
            )}
          </div>

          <div className="summary-card">
            <h2>Secuencia de emails</h2>
            {emailLogs.length ? (
              emailLogs.map((log) => (
                <article className="data-card" key={log.id}>
                  <strong>{log.subject}</strong>
                  <p>Destino: {log.email}</p>
                  <p>Enviado: {log.sentAt}</p>
                  <pre className="email-preview">{log.body}</pre>
                  <div className="product-action-row">
                    <button
                      className="secondary-button"
                      onClick={() => markEmailOpened(log.id)}
                    >
                      Marcar como abierto
                    </button>
                    <span className="email-status">
                      {log.openedAt ? "Abierto" : "Pendiente"}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="section-description">
                No hay correos enviados todavia.
              </p>
            )}
          </div>
        </section>

        <section className="summary-card evidence-card">
          <h2>Evidencia para la actividad</h2>
          <ul className="evidence-list">
            <li>Heatmap: capturar clics, scroll y zonas calientes dentro de Clarity.</li>
            <li>Session Recording: abrir una grabacion donde se abandona checkout.</li>
            <li>Emails: mostrar en este panel Email 1, Email 2 y Email 3.</li>
            <li>Funnel: usar este dashboard para ubicar el punto de abandono.</li>
          </ul>
          <div className="product-action-row">
            <button className="secondary-button" onClick={simulateAbandonmentNow}>
              Simular abandono
            </button>
            <button
              className="secondary-button"
              onClick={() => {
                accelerateEmailSequence();
                window.setTimeout(() => processRecoveryEmails(), 0);
              }}
            >
              Acelerar emails
            </button>
            <button className="secondary-button" onClick={clearDemoData}>
              Reiniciar datos
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;
