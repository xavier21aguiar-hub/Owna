import { NavLink } from "react-router-dom";
import { blogs } from "../data/blogs";

const categories = [
  "Consejos",
  "Fitness",
  "Estilo de vida",
  "Entrenamiento",
  "Nutricion",
];

function Sidebar() {
  return (
    <aside className="blog-sidebar">
      <div className="sidebar-block">
        <h2>BUSCAR BLOG</h2>
        <input className="sidebar-search" placeholder="Buscar..." />
      </div>

      <div className="sidebar-block">
        <h2>CATEGORIAS</h2>
        <ul className="sidebar-list">
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>

      <div className="sidebar-block">
        <h2>ENTRADAS RECIENTES</h2>
        <ul className="recent-posts">
          {blogs.map((blog) => (
            <li key={blog.id}>
              <NavLink className="recent-post-link" to={`/blog/${blog.slug}`}>
                <span>{blog.category}</span>
                <strong>{blog.title}</strong>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
