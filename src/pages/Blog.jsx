import { Navigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { blogs } from "../data/blogs";

function Blog() {
  const { slug } = useParams();
  const featuredPost = slug
    ? blogs.find((blog) => blog.slug === slug)
    : blogs[0];

  if (!featuredPost) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <main className="blog-layout">
      <section className="blog-main">
        <p className="eyebrow">{featuredPost.category}</p>
        <h1 className="blog-title">{featuredPost.title}</h1>
        <img
          className="blog-hero-image"
          src={featuredPost.image}
          alt={featuredPost.title}
        />
        <p className="blog-intro">{featuredPost.intro || featuredPost.excerpt}</p>

        {featuredPost.content.map((section) => (
          <section className="blog-copy-block" key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </section>

      <Sidebar />
    </main>
  );
}

export default Blog;
