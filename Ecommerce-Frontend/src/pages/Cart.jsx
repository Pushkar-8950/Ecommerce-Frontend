import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  Heart,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import "./Cart.css";

const defaultCartItems = [
  {
    id: 1,
    name: "Handwoven Cotton Dupatta",
    artisan: "Meera Handlooms",
    category: "Textiles",
    price: 899,
    quantity: 1,
    image: "/src/assets/products/dupatta.jpg",
  },
  {
    id: 2,
    name: "Blue Pottery Vase",
    artisan: "Jaipur Crafts",
    category: "Pottery",
    price: 1249,
    quantity: 1,
    image: "/src/assets/products/vase.jpg",
  },
];


function Cart() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return defaultCartItems;
  });

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

            {items.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* Image */}

                <div className="cart-item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>


                {/* Info */}

                <div className="cart-item-info">

                  <span className="cart-item-category">
                    {item.category}
                  </span>

                  <Link
                    to={`/product/${item.id}`}
                    className="cart-item-name"
                  >
                    {item.name}
                  </Link>

                  <span className="cart-item-artisan">
                    by {item.artisan}
                  </span>

                  <span className="cart-item-price">
                    ₹{item.price.toLocaleString()}
                  </span>


                  {/* Actions */}

                  <div className="cart-item-actions">

                    <div className="cart-quantity">

                      <button>
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>

                      <button>
                        <Plus size={14} />
                      </button>

                    </div>


                    <button className="cart-action-button">
                      <Heart size={15} />
                      Move to Wishlist
                    </button>


                    <button className="cart-action-button delete">
                      <Trash2 size={15} />
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

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
            <strong>₹2,148</strong>
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
            <strong>₹2,148</strong>
          </div>


          <button className="checkout-button">
            Proceed to Checkout
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