import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Owna Performance Wear</p>
        <h1>Train with confidence</h1>
        <p>
          Siluetas activas, soporte real y una estetica limpia para entrenar
          fuerte sin renunciar al estilo.
        </p>
        <Link className="hero-button" to="/shop">
          SHOP NOW
        </Link>
      </div>
    </section>
  );
}

export default Hero;
