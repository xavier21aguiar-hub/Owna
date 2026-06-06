function FunnelInsights({ metrics }) {
  const stages = [
    { label: "Visitas a producto", value: metrics.productViews },
    { label: "Agregados al carrito", value: metrics.addToCart },
    { label: "Inicio de checkout", value: metrics.checkoutStarted },
    { label: "Compras completadas", value: metrics.purchases },
  ];

  return (
    <div className="funnel-board">
      {stages.map((stage, index) => {
        const next = stages[index + 1];
        const drop = next ? Math.max(stage.value - next.value, 0) : 0;

        return (
          <article className="metric-card" key={stage.label}>
            <span className="metric-label">{stage.label}</span>
            <strong className="metric-value">{stage.value}</strong>
            {next ? (
              <p className="metric-note">
                Posible abandono hacia la siguiente etapa: {drop}
              </p>
            ) : (
              <p className="metric-note">Etapa final del funnel.</p>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default FunnelInsights;
