import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

function Categories() {
  return (
    <main className="categories-page">
      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Shop the edit</p>
          <h1>Colecciones OWNA</h1>
          <p className="section-description">
            Explora leggings, tops, sets y accesorios con un look deportivo y
            minimalista.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Categories;
