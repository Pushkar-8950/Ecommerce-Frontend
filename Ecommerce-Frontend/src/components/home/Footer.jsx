import { Link } from "react-router-dom";
import "./Footer.css";
import { ChevronUp } from "lucide-react";
function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      {/* Back to top */}

      <div className="footer-back-to-top"> 

        <ChevronUp size={16} color="black"/>
        <Link to="#" onClick={scrollToTop}>Back to top</Link>
      </div>


      {/* Main Footer */}

      <div className="footer-main">

        <div className="footer-container">

          {/* Explore */}

          <div className="footer-column">
            <h3>Explore Crafts</h3>

            <Link to="/explore">All Products</Link>
            <Link to="/explore?category=textiles">Textiles</Link>
            <Link to="/explore?category=jewellery">Jewellery</Link>
            <Link to="/explore?category=home-decor">Home Decor</Link>
            <Link to="/explore?category=pottery">Pottery</Link>
            <Link to="/explore?category=woodcraft">Woodcraft</Link>
          </div>


          {/* Buyers */}

          <div className="footer-column">
            <h3>For Buyers</h3>

            <Link to="/explore">Explore Products</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/profile">My Account</Link>
          </div>


          {/* Artisans */}

          <div className="footer-column">
            <h3>For Artisans</h3>

            <Link to="/register">Become an Artisan</Link>
            <Link to="/login">Artisan Login</Link>
            <Link to="/dashboard">Artisan Dashboard</Link>
            <Link to="/add-product">Add a Product</Link>
            <Link to="/ai-studio">AI Product Assistant</Link>
          </div>


          {/* Help */}

          <div className="footer-column">
            <h3>Help & Support</h3>

            <Link to="/help">Help Center</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/about">About Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>

        </div>

      </div>


      {/* Brand Bar */}

      <div className="footer-brand-bar">

        <div className="footer-brand-container">

          <div className="footer-logo">
            Hunar<span>Bazaar</span>
          </div>

          <div className="footer-country">
            🇮🇳 Made for Indian Artisans
          </div>

        </div>

      </div>


      {/* Bottom */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
            © {new Date().getFullYear()} HunarBazaar.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;