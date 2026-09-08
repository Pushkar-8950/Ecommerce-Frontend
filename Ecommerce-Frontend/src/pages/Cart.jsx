import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  Heart,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      if (res.data?.cart?.items) {
        setItems(res.data.cart.items);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.warn("Could not fetch cart from server:", err);
      const saved = localStorage.getItem("cart");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setItems(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    window.addEventListener("cartUpdated", fetchCart);
    return () => window.removeEventListener("cartUpdated", fetchCart);
  }, []);

  const handleUpdateQuantity = async (item, delta) => {
    const targetId = item.itemId || item._id || item.productId || item.id;
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      await handleRemoveItem(item);
      return;
    }

    try {
      const res = await api.put(`/cart/${targetId}`, { quantity: newQty });
      if (res.data?.cart?.items) {
        setItems(res.data.cart.items);
      } else {
        setItems((prev) =>
          prev.map((i) =>
            (i.itemId === targetId || i.id === targetId)
              ? { ...i, quantity: newQty }
              : i
          )
        );
      }
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.warn("Failed to update cart item on server:", err);
      setItems((prev) => {
        const updated = prev.map((i) =>
          (i.itemId === targetId || i.id === targetId)
            ? { ...i, quantity: newQty }
            : i
        );
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleRemoveItem = async (item) => {
    const targetId = item.itemId || item._id || item.productId || item.id;
    try {
      const res = await api.delete(`/cart/${targetId}`);
      if (res.data?.cart?.items) {
        setItems(res.data.cart.items);
      } else {
        setItems((prev) =>
          prev.filter((i) => i.itemId !== targetId && i.id !== targetId && i.productId !== targetId)
        );
      }
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.warn("Failed to remove item on server:", err);
      setItems((prev) => {
        const updated = prev.filter(
          (i) => i.itemId !== targetId && i.id !== targetId && i.productId !== targetId
        );
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleMoveToWishlist = async (item) => {
    const prodId = item.productId || item.id;
    try {
      await api.post("/wishlist", { productId: prodId });
    } catch (err) {
      console.warn("Move to wishlist error:", err);
    }
    await handleRemoveItem(item);
  };

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) return;
    setIsCheckingOut(true);

    try {
      await api.post("/orders", {
        items: items.map((i) => ({
          productId: i.productId || i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        totalAmount: subtotal,
        shippingAddress: {
          street: "123 Artisan Heritage Marg",
          city: "Jaipur",
          state: "Rajasthan",
          pincode: "302001",
        },
        paymentMethod: "Cash on Delivery",
      });

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/orders");
    } catch (err) {
      console.error("Checkout failed:", err);
      if (err.response?.status === 401) {
        alert("Please log in to complete your order.");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Failed to complete checkout.");
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  return (
    <main className="cart-page">

      {/* ================= HEADER ================= */}

      <div className="cart-header">
        <div className="cart-header-container">

          <h1>Your Shopping Cart</h1>

          <span>
            {items.length} items in your cart
          </span>

        </div>
      </div>


      {/* ================= CART CONTENT ================= */}

      <div className="cart-container">

        {/* ================= ITEMS ================= */}

        <section className="cart-items-section">

          <div className="cart-items-header">
            <h2>Cart Items</h2>

            <span>{items.length} Items</span>
          </div>


          <div className="cart-items-list">

            {items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 16px", color: "#6b7280" }}>
                <p style={{ fontSize: "16px", marginBottom: "16px" }}>Your shopping cart is currently empty.</p>
                <Link to="/explore" className="continue-shopping" style={{ display: "inline-flex", marginTop: "8px" }}>
                  <ArrowRight size={16} />
                  Discover Artisan Crafts
                </Link>
              </div>
            ) : (
              items.map((item) => (

                <div
                  className="cart-item"
                  key={item.itemId || item.id || item._id}
                >

                  {/* Image */}

                  <div className="cart-item-image">
                    <img
                      src={item.image || "/src/assets/products/dupatta.jpg"}
                      alt={item.name}
                    />
                  </div>


                  {/* Info */}

                  <div className="cart-item-info">

                    <span className="cart-item-category">
                      {item.category || "Handicraft"}
                    </span>

                    <Link
                      to={`/product/${item.productId || item.id}`}
                      className="cart-item-name"
                    >
                      {item.name}
                    </Link>

                    <span className="cart-item-artisan">
                      by {item.artisan || "Master Artisan"}
                    </span>

                    <span className="cart-item-price">
                      ₹{(Number(item.price) || 0).toLocaleString()}
                    </span>


                    {/* Actions */}

                    <div className="cart-item-actions">

                      <div className="cart-quantity">

                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>

                      </div>


                      <button
                        type="button"
                        className="cart-action-button"
                        onClick={() => handleMoveToWishlist(item)}
                      >
                        <Heart size={15} />
                        Move to Wishlist
                      </button>


                      <button
                        type="button"
                        className="cart-action-button delete"
                        onClick={() => handleRemoveItem(item)}
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              ))
            )}

          </div>


          {/* Continue Shopping */}

          <Link
            to="/explore"
            className="continue-shopping"
          >
            <ArrowRight size={16} />
            Continue Shopping
          </Link>

        </section>


        {/* ================= SUMMARY ================= */}

        <aside className="cart-summary">

          <h2>Order Summary</h2>


          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal.toLocaleString()}</strong>
          </div>


          <div className="summary-row">
            <span>Delivery</span>
            <strong className="free-text">
              FREE
            </strong>
          </div>


          <div className="summary-row">
            <span>Taxes</span>
            <strong>Included</strong>
          </div>


          <div className="summary-divider" />


          <div className="summary-total">
            <span>Total</span>
            <strong>₹{subtotal.toLocaleString()}</strong>
          </div>


          <button
            type="button"
            className="checkout-button"
            onClick={handleCheckout}
            disabled={items.length === 0 || isCheckingOut}
          >
            {isCheckingOut ? "Placing Order..." : "Proceed to Checkout"}
            <ArrowRight size={18} />
          </button>


          <div className="secure-checkout">

            <ShieldCheck size={18} />

            <div>
              <strong>Secure Checkout</strong>
              <span>
                Your payment information is protected.
              </span>
            </div>

          </div>

        </aside>

      </div>


      {/* ================= RECOMMENDATIONS ================= */}

      <section className="cart-recommendations">

        <div className="cart-recommendations-container">

          <div className="cart-recommendations-header">

            <div>
              <span>You May Also Like</span>

              <h2>
                Continue Exploring
              </h2>
            </div>

            <Link to="/explore">
              View All
              <ArrowRight size={16} />
            </Link>

          </div>


          <div className="cart-recommendation-grid">

            <Link
              to="/product/3"
              className="cart-recommendation-card"
            >

              <div className="recommendation-image">
                <img
                  src="/src/assets/products/elephant.jpg"
                  alt="Handcrafted Wooden Elephant"
                />
              </div>

              <div className="recommendation-info">

                <h3>
                  Handcrafted Wooden Elephant
                </h3>

                <strong>
                  ₹749
                </strong>

              </div>

            </Link>


            <Link
              to="/product/4"
              className="cart-recommendation-card"
            >

              <div className="recommendation-image">
                <img
                  src="/src/assets/products/diya.jpg"
                  alt="Traditional Brass Diya Set"
                />
              </div>

              <div className="recommendation-info">

                <h3>
                  Traditional Brass Diya Set
                </h3>

                <strong>
                  ₹599
                </strong>

              </div>

            </Link>


            <Link
              to="/product/5"
              className="cart-recommendation-card"
            >

              <div className="recommendation-image">
                <img
                  src="/src/assets/products/cushion.jpg"
                  alt="Handmade Silk Cushion Cover"
                />
              </div>

              <div className="recommendation-info">

                <h3>
                  Handmade Silk Cushion Cover
                </h3>

                <strong>
                  ₹699
                </strong>

              </div>

            </Link>


            <Link
              to="/explore"
              className="cart-recommendation-card explore-card"
            >

              <div className="explore-card-content">

                <ArrowRight size={28} />

                <h3>
                  Explore More Crafts
                </h3>

                <span>
                  Discover products from artisans across India
                </span>

              </div>

            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Cart;