import { useState } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  MapPin,
  Package,
  Minus,
  Plus,
  ChevronRight,
  Check,
} from "lucide-react";

import { Link } from "react-router-dom";
import "./ProductDetails.css";

const productImages = [
  "/src/assets/products/dupatta.jpg",
  "/src/assets/products/dupatta.jpg",
  "/src/assets/products/dupatta.jpg",
  "/src/assets/products/dupatta.jpg",
];

const relatedProducts = [
  {
    id: 2,
    name: "Blue Pottery Vase",
    price: "₹1,249",
    image: "/src/assets/products/vase.jpg",
  },
  {
    id: 3,
    name: "Handcrafted Wooden Elephant",
    price: "₹749",
    image: "/src/assets/products/elephant.jpg",
  },
  {
    id: 4,
    name: "Traditional Brass Diya Set",
    price: "₹599",
    image: "/src/assets/products/diya.jpg",
  },
  {
    id: 5,
    name: "Handmade Silk Cushion Cover",
    price: "₹699",
    image: "/src/assets/products/cushion.jpg",
  },
];

function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [buyMessage, setBuyMessage] = useState("");

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);

    setTimeout(() => {
      setIsAddedToCart(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    setBuyMessage("Proceeding to checkout...");

    setTimeout(() => {
      setBuyMessage("");
    }, 2000);
  };

  return (
    <main className="product-details-page">

      {/* ================= BREADCRUMB ================= */}

      <div className="product-breadcrumb-container">
        <div className="product-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={15} />
          <Link to="/explore">Explore</Link>
          <ChevronRight size={15} />
          <span>Handwoven Cotton Dupatta</span>
        </div>
      </div>

      {/* ================= PRODUCT MAIN ================= */}

      <section className="product-main-section">
        <div className="product-main-container">

          {/* PRODUCT GALLERY */}

          <div className="product-gallery">

            <div className="product-main-image">
              <img
                src={productImages[selectedImage]}
                alt="Handwoven Cotton Dupatta"
              />

              <button
                className={`product-details-wishlist ${
                  isWishlisted ? "active" : ""
                }`}
                onClick={() =>
                  setIsWishlisted((prev) => !prev)
                }
                aria-label="Toggle wishlist"
              >
                <Heart
                  size={21}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Thumbnails */}

            <div className="product-thumbnails">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`product-thumbnail ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                  />
                </button>
              ))}
            </div>

          </div>

          {/* PRODUCT INFO */}

          <div className="product-main-info">

            <span className="product-details-category">
              TEXTILES
            </span>

            <h1>Handwoven Cotton Dupatta</h1>

            {/* Rating */}

            <div className="product-details-rating">
              <span className="product-details-rating-box">
                4.8
                <Star size={13} fill="currentColor" />
              </span>

              <span className="product-rating-text">
                124 Ratings
              </span>
            </div>

            {/* Price */}

            <div className="product-details-price">
              ₹899
            </div>

            <div className="product-price-note">
              Inclusive of all taxes
            </div>

            {/* Description */}

            <p className="product-short-description">
              A beautifully handwoven cotton dupatta created
              using traditional weaving techniques by skilled
              artisans. Lightweight, elegant, and perfect for
              everyday wear or special occasions.
            </p>

            <div className="product-divider" />

            {/* Quantity */}

            <div className="product-quantity-section">

              <span>Quantity</span>

              <div className="quantity-selector">

                <button
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span>{quantity}</span>

                <button
                  onClick={increaseQuantity}
                  disabled={quantity === 10}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>

              </div>

            </div>

            {/* Buttons */}

            <div className="product-action-buttons">

              <button
                className={`product-add-cart ${
                  isAddedToCart ? "added" : ""
                }`}
                onClick={handleAddToCart}
              >
                {isAddedToCart ? (
                  <>
                    <Check size={19} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={19} />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                className="product-buy-now"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

            </div>

            {buyMessage && (
              <div className="buy-message">
                {buyMessage}
              </div>
            )}

            {/* Delivery */}

            <div className="product-delivery-info">

              <Package size={19} />

              <div>
                <strong>Free Delivery Available</strong>

                <span>
                  Estimated delivery within 5–7 days
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= DESCRIPTION ================= */}

      <section className="product-information-section">

        <div className="product-information-container">

          <div className="product-description">

            <h2>Product Description</h2>

            <p>
              This handcrafted cotton dupatta represents the
              timeless tradition of Indian handloom weaving.
              Every piece is carefully woven by skilled artisans,
              making each product unique.
            </p>

            <p>
              The lightweight cotton fabric provides comfort while
              preserving the authenticity and beauty of traditional
              craftsmanship.
            </p>

          </div>

          <div className="product-specifications">

            <h2>Product Details</h2>

            <div className="specification-list">

              <div className="specification-item">
                <span>Material</span>
                <strong>Pure Cotton</strong>
              </div>

              <div className="specification-item">
                <span>Craft</span>
                <strong>Handloom Weaving</strong>
              </div>

              <div className="specification-item">
                <span>Origin</span>
                <strong>Haryana, India</strong>
              </div>

              <div className="specification-item">
                <span>Dimensions</span>
                <strong>2.5 metres</strong>
              </div>

              <div className="specification-item">
                <span>Care</span>
                <strong>Hand Wash</strong>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= ARTISAN ================= */}

      <section className="artisan-section">

        <div className="artisan-container">

          <div className="section-heading">
            <span>MEET THE MAKER</span>
            <h2>About the Artisan</h2>
          </div>

          <div className="artisan-card">

            <div className="artisan-profile">

              <div className="artisan-avatar">
                M
              </div>

              <div>
                <h3>Meera Handlooms</h3>
                <p>Traditional Handloom Artisan</p>
              </div>

            </div>

            <div className="artisan-detail">
              <MapPin size={18} />

              <div>
                <span>Location</span>
                <strong>Panipat, Haryana</strong>
              </div>
            </div>

            <div className="artisan-detail">
              <Package size={18} />

              <div>
                <span>Specialization</span>
                <strong>Handloom Textiles</strong>
              </div>
            </div>

            <div className="artisan-story">

              <p>
                For over 15 years, Meera and her family have
                preserved the traditional art of handloom weaving,
                creating authentic textiles with care and
                craftsmanship.
              </p>

              <Link
                to="/artisan/meera-handlooms"
                className="view-artisan-btn"
              >
                View Artisan Profile
              </Link>

            </div>

          </div>
        </div>

      </section>

      {/* ================= RELATED PRODUCTS ================= */}

      <section className="related-products-section">

        <div className="related-products-container">

          <div className="related-products-header">

            <div>
              <span>YOU MAY ALSO LIKE</span>
              <h2>Related Products</h2>
            </div>

            <Link to="/explore">
              View All
              <ChevronRight size={17} />
            </Link>

          </div>

          <div className="related-products-grid">

            {relatedProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                className="related-product-card"
                key={product.id}
              >
                <div className="related-product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </div>

                <div className="related-product-info">
                  <h3>{product.name}</h3>
                  <strong>{product.price}</strong>
                </div>
              </Link>
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;