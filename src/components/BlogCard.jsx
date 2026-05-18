import { Link } from "react-router-dom";

function BlogCard({ blog }) {
  return (
    <Link className="blog-card" to={`/blog/${blog.slug}`}>
      <img src={blog.image} alt={blog.title} />
      <div className="blog-card-body">
        <span>{blog.category}</span>
        <h3>{blog.title}</h3>
        <p>{blog.excerpt}</p>
      </div>
    </Link>
  );
}

export default BlogCard;
