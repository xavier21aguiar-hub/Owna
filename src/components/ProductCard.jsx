import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { formatCurrency } from "../lib/shop-utils";

function ProductCard({ product }) {
  const { addToCart } = useShop();

  return (
    <article className="product-card">
      <Link
        to={`/product/${product.slug}`}
        className="product-card-image"
        style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,0.35)), url(${product.image})` }}
      />
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <strong className="product-price">{formatCurrency(product.price)}</strong>
        <p>{product.description}</p>
        <div className="product-card-actions">
          <Link className="secondary-button" to={`/product/${product.slug}`}>
            Ver producto
          </Link>
          <button className="primary-button" onClick={() => addToCart(product)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
