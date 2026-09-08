import { Heart, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./FeaturedProducts.css";

const products = [
  {
    id: 1,
    name: "Handwoven Cotton Dupatta",
    artisan: "Meera Handlooms",
    category: "Textiles",
    price: "₹899",
    rating: "4.8",
    reviews: 124,
    image: "/src/assets/products/dupatta.jpg",
  },
  {
    id: 2,
    name: "Blue Pottery Vase",
    artisan: "Jaipur Crafts",
    category: "Pottery",
    price: "₹1,249",
    rating: "4.7",
    reviews: 86,
    image: "/src/assets/products/vase.jpg",
  },
  {
    id: 3,
    name: "Handcrafted Wooden Elephant",
    artisan: "Rajasthan Artisans",
    category: "Woodcraft",
    price: "₹749",
    rating: "4.9",
    reviews: 213,
    image: "/src/assets/products/elephant.jpg",
  },
  {
    id: 4,
    name: "Traditional Brass Diya Set",
    artisan: "Kashi Metalworks",
    category: "Metal Crafts",
    price: "₹599",
    rating: "4.6",
    reviews: 71,
    image: "/src/assets/products/diya.jpg",
  },
  {
    id: 5,
    name: "Handwoven Cotton Dupatta",
    artisan: "Meera Handlooms",
    category: "Textiles",
    price: "₹899",
    rating: "4.8",
    reviews: 124,
    image: "/src/assets/products/dupatta.jpg",
  },
  {
    id: 6,
    name: "Handwoven Cotton Dupatta",
    artisan: "Meera Handlooms",
    category: "Textiles",
    price: "₹899",
    rating: "4.8",
    reviews: 124,
    image: "/src/assets/products/dupatta.jpg",
  },
  {
    id: 7,
    name: "Handwoven Cotton Dupatta",
    artisan: "Meera Handlooms",
    category: "Textiles",
    price: "₹899",
    rating: "4.8",
    reviews: 124,
    image: "/src/assets/products/dupatta.jpg",
  },
  {
    id: 8,
    name: "Handwoven Cotton Dupatta",
    artisan: "Meera Handlooms",
    category: "Textiles",
    price: "₹899",
    rating: "4.8",
    reviews: 124,
    image: "/src/assets/products/dupatta.jpg",
  },
];

function FeaturedProducts() {
  return (
    <section className="featured-products">
      <div className="featured-products-container">

        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>

              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />

                <button
                  className="product-wishlist"
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  <Heart size={18} />
                </button>
              </div>

              <div className="product-info">

                <span className="product-category">
                  {product.category}
                </span>

                <Link
                  to={`/product/${product.id}`}
                  className="product-name"
                >
                  {product.name}
                </Link>

                <span className="product-artisan">
                  by {product.artisan}
                </span>

                <div className="product-rating">
                  <span className="rating-box">
                    {product.rating}
                    <Star size={12} fill="currentColor" />
                  </span>

                  <span className="review-count">
                    ({product.reviews})
                  </span>
                </div>

                <div className="product-bottom">
                  <span className="product-price">
                    {product.price}
                  </span>

                  <button className="add-cart-btn">
                    Add to cart
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedProducts;