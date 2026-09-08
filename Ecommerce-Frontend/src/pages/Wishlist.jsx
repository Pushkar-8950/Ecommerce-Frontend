import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";
import "./Wishlist.css";

const wishlistItems = [
  {
    id: 1,
    name: "Handwoven Cotton Dupatta",
    artisan: "Meera Handlooms",
    category: "Textiles",
    price: 899,
    rating: 4.8,
    reviews: 124,
    image: "/src/assets/products/dupatta.jpg",
  },
  {
    id: 2,
    name: "Blue Pottery Vase",
    artisan: "Jaipur Crafts",
    category: "Pottery",
    price: 1249,
    rating: 4.7,
    reviews: 86,
    image: "/src/assets/products/vase.jpg",
  },
  {
    id: 3,
    name: "Handcrafted Wooden Elephant",
    artisan: "Rajasthan Artisans",
    category: "Woodcraft",
    price: 749,
    rating: 4.9,
    reviews: 213,
    image: "/src/assets/products/elephant.jpg",
  },
  {
    id: 4,
    name: "Traditional Brass Diya Set",
    artisan: "Kashi Metalworks",
    category: "Metal Crafts",
    price: 599,
    rating: 4.6,
    reviews: 71,
    image: "/src/assets/products/diya.jpg",
  },
];

function Wishlist() {
  return (
    <main className="wishlist-page">

      {/* ================= HEADER ================= */}

      <div className="wishlist-header">
        <div className="wishlist-header-container">

          <div className="wishlist-title-row">

            <div>
              <h1>My Wishlist</h1>
              <span>
                {wishlistItems.length} saved items
              </span>
            </div>

          </div>

        </div>
      </div>


      {/* ================= WISHLIST ================= */}

      <section className="wishlist-content">

        <div className="wishlist-container">

          <div className="wishlist-items">

            {wishlistItems.map((item) => (

              <article
                className="wishlist-item"
                key={item.id}
              >

                {/* Image */}

                <Link
                  to={`/product/${item.id}`}
                  className="wishlist-item-image"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </Link>


                {/* Info */}

                <div className="wishlist-item-info">

                  <span className="wishlist-category">
                    {item.category}
                  </span>

                  <Link
                    to={`/product/${item.id}`}
                    className="wishlist-item-name"
                  >
                    {item.name}
                  </Link>

                  <span className="wishlist-artisan">
                    by {item.artisan}
                  </span>

                  <div className="wishlist-rating">

                    <span className="wishlist-rating-box">
                      {item.rating}
                      <Star
                        size={11}
                        fill="currentColor"
                      />
                    </span>

                    <span>
                      ({item.reviews})
                    </span>

                  </div>

                  <strong className="wishlist-price">
                    ₹{item.price.toLocaleString()}
                  </strong>

                </div>


                {/* Actions */}

                <div className="wishlist-item-actions">

                  <button className="wishlist-cart-btn">
                    <ShoppingCart size={17} />
                    Add to Cart
                  </button>

                  <button className="wishlist-remove-btn">
                    <Trash2 size={16} />
                    Remove
                  </button>

                </div>

              </article>

            ))}

          </div>


          {/* ================= SIDE PANEL ================= */}

          <aside className="wishlist-side-panel">

            <div className="wishlist-side-icon">
              <Heart size={24} />
            </div>

            <h2>
              Your saved crafts
            </h2>

            <p>
              Keep your favourite handcrafted products here
              and come back whenever you're ready.
            </p>

            <Link
              to="/explore"
              className="wishlist-explore-btn"
            >
              Explore More Crafts
              <ArrowRight size={17} />
            </Link>

          </aside>

        </div>

      </section>

    </main>
  );
}

export default Wishlist;