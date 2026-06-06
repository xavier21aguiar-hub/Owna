import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { formatCurrency } from "../lib/shop-utils";
import { products } from "../data/products";

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart, viewProduct } = useShop();
  const product = products.find((item) => item.slug === slug);

  useEffect(() => {
    if (product) {
      viewProduct(product, `/product/${product.slug}`);
    }
  }, [product?.slug]);

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <main className="product-detail-page">
      <section className="product-detail-grid">
        <div
          className="product-detail-image"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(18,18,18,0.05), rgba(18,18,18,0.25)), url(${product.image})`,
          }}
        />

        <div className="product-detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <strong className="product-price">{formatCurrency(product.price)}</strong>
          <p className="section-description">{product.longDescription}</p>

          <div className="product-meta-group">
            <div>
              <span className="meta-heading">Tallas</span>
              <p>{product.sizes.join(" · ")}</p>
            </div>
            <div>
              <span className="meta-heading">Colores</span>
              <p>{product.colors.join(" · ")}</p>
            </div>
          </div>

          <div className="product-action-row">
            <button className="primary-button" onClick={() => addToCart(product)}>
              Agregar al carrito
            </button>
            <Link className="secondary-button" to="/cart">
              Ver carrito
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
