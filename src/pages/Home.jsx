import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import BlogCard from "../components/BlogCard";
import { products } from "../data/products";
import { blogs } from "../data/blogs";

function Home() {
  return (
    <main>
      <Hero />

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Nuevas colecciones</p>
          <h2>NUEVAS COLECCIONES</h2>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-block editorial-preview">
        <div className="section-heading">
          <p className="eyebrow">Editorial</p>
          <h2>Desde el blog</h2>
        </div>

        <div className="blog-preview-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
