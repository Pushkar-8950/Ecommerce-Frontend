import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-eyebrow">
            Discover India's Craft
          </span>

          <h1>
            Crafted by hands.
            <br />
            <span>Made to be discovered.</span>
          </h1>

          <div className="hero-actions">
            <Link to="/explore" className="hero-primary-btn">
              Explore Crafts
              <ArrowRight size={18} />
            </Link>

            <Link to="/register" className="hero-secondary-btn">
              Become an Artisan
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          {/* Decorative glow orbs */}
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          <div className="hero-image-placeholder" />

          <div className="hero-floating-card">
            <span className="hero-card-label">Handcrafted</span>
            <strong>Made with tradition</strong>
            <span className="card-sub">1,200+ artisans &amp; counting</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;