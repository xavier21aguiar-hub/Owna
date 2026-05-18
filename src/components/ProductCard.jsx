function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div
        className="product-card-image"
        style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,0.35)), url(${product.image})` }}
      />
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>
    </article>
  );
}

export default ProductCard;
