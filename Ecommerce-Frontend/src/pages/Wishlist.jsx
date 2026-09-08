import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Star,
} from "lucide-react";
import api from "../services/api";
import "./Wishlist.css";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      if (res.data?.products) {
        setItems(res.data.products);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.warn("Could not load wishlist from server:", err);
      // Fallback empty or local
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (item) => {
    const targetId = item.id || item._id;
    try {
      const res = await api.delete(`/wishlist/${targetId}`);
      if (res.data?.products) {
        setItems(res.data.products);
      } else {
        setItems((prev) => prev.filter((i) => (i.id || i._id) !== targetId));
      }
    } catch (err) {
      console.warn("Failed to remove item from wishlist:", err);
      setItems((prev) => prev.filter((i) => (i.id || i._id) !== targetId));
    }
  };

  const handleMoveToCart = async (item) => {
    const targetId = item.id || item._id;
    try {
      await api.post("/cart", { productId: targetId, quantity: 1 });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.warn("Error adding to cart from wishlist:", err);
    }
    await handleRemove(item);
  };

  return (
    <main className="wishlist-page">

      {/* ================= HEADER ================= */}

      <div className="wishlist-header">
        <div className="wishlist-header-container">

          <div className="wishlist-title-row">

            <div>
              <h1>My Wishlist</h1>
              <span>
                {items.length} saved items
              </span>
            </div>

          </div>

        </div>
      </div>


      {/* ================= WISHLIST ================= */}

      <section className="wishlist-content">

        <div className="wishlist-container">

          <div className="wishlist-items">

            {items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 16px", color: "#6b7280" }}>
                <p style={{ fontSize: "16px", marginBottom: "16px" }}>Your wishlist is currently empty.</p>
                <Link to="/explore" className="wishlist-explore-btn" style={{ display: "inline-flex" }}>
                  Explore Crafts
                  <ArrowRight size={17} />
                </Link>
              </div>
            ) : (
              items.map((item) => (

                <article
                  className="wishlist-item"
                  key={item.id || item._id}
                >

                  {/* Image */}

                  <Link
                    to={`/product/${item.id || item._id}`}
                    className="wishlist-item-image"
                  >
                    <img
                      src={item.image || "/src/assets/products/dupatta.jpg"}
                      alt={item.name}
                    />
                  </Link>


                  {/* Info */}

                  <div className="wishlist-item-info">

                    <span className="wishlist-category">
                      {item.category || "Craft"}
                    </span>

                    <Link
                      to={`/product/${item.id || item._id}`}
                      className="wishlist-item-name"
                    >
                      {item.name}
                    </Link>

                    <span className="wishlist-artisan">
                      by {item.artisan || "Master Artisan"}
                    </span>

                    <div className="wishlist-rating">

                      <span className="wishlist-rating-box">
                        {item.rating || 4.8}
                        <Star
                          size={11}
                          fill="currentColor"
                        />
                      </span>

                      <span>
                        ({item.reviews || 0})
                      </span>

                    </div>

                    <strong className="wishlist-price">
                      ₹{(Number(item.price) || 0).toLocaleString()}
                    </strong>

                  </div>


                  {/* Actions */}

                  <div className="wishlist-item-actions">

                    <button
                      type="button"
                      className="wishlist-cart-btn"
                      onClick={() => handleMoveToCart(item)}
                    >
                      <ShoppingCart size={17} />
                      Move to Cart
                    </button>

                    <button
                      type="button"
                      className="wishlist-remove-btn"
                      onClick={() => handleRemove(item)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>

                  </div>

                </article>

              ))
            )}

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