import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  Pencil,
  ShoppingCart
} from "lucide-react";

import { Link } from "react-router-dom";
import "./Account.css";

function Account() {
  return (
    <main className="account-page">

      {/* ================= HEADER ================= */}

      <div className="account-header">

        <div className="account-header-container">

          <div>
            <h1>My Account</h1>
          </div>

        </div>

      </div>


      {/* ================= MAIN ================= */}

      <div className="account-container">

        {/* ================= SIDEBAR ================= */}

        <aside className="account-sidebar">

          <div className="account-profile-mini">

            <div className="account-avatar">
              P
            </div>

            <div>
              <strong>Pushkar</strong>
              <span>pushkar@example.com</span>
            </div>

          </div>


          <nav className="account-nav">

            <Link
              to="/account"
              className="account-nav-item active"
            >
              <User size={17} />
              <span>Profile</span>
            </Link>


            <Link
              to="/orders"
              className="account-nav-item"
            >
              <Package size={17} />
              <span>My Orders</span>
            </Link>


            <Link
              to="/wishlist"
              className="account-nav-item"
            >
              <Heart size={17} />
              <span>Wishlist</span>
            </Link>


            <Link
              to="/addresses"
              className="account-nav-item"
            >
              <MapPin size={17} />
              <span>Saved Addresses</span>
            </Link>

          </nav>


          <button className="account-signout">
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>

        </aside>


        {/* ================= CONTENT ================= */}

        <section className="account-content">

          {/* Profile */}

          <div className="account-section">

            <div className="account-section-header">

              <div>
                <h2>Personal Information</h2>
              </div>

              <button className="account-edit-btn">
                <Pencil size={15} />
                Edit
              </button>

            </div>


            <div className="account-details-grid">

              <div className="account-detail">

                <span>Full Name</span>

                <strong>
                  Pushkar Sehrawat
                </strong>

              </div>


              <div className="account-detail">

                <span>Email</span>

                <strong>
                  pushkar@example.com
                </strong>

              </div>


              <div className="account-detail">

                <span>Phone</span>

                <strong>
                  +91 98XXXXXXXX
                </strong>

              </div>

            </div>

          </div>


          {/* Shopping Overview */}

          <div className="account-section">

            <div className="account-section-header">

              <div>
                <h2>Your Activity</h2>
              </div>

            </div>


            <div className="account-overview-grid">

              <Link
                to="/orders"
                className="account-overview-card"
              >

                <div className="overview-icon">
                  <Package size={20} />
                </div>

                <div>
                  <strong>My Orders</strong>

                  <span>
                    View your orders
                  </span>
                </div>

                <ChevronRight size={18} />

              </Link>


              <Link
                to="/wishlist"
                className="account-overview-card"
              >

                <div className="overview-icon">
                  <Heart size={20} />
                </div>

                <div>
                  <strong>Wishlist</strong>

                  <span>
                    View saved products
                  </span>
                </div>

                <ChevronRight size={18} />

              </Link>


              <Link
                to="/cart"
                className="account-overview-card"
              >

                <div className="overview-icon">
                  <ShoppingCart size={20} />
                </div>

                <div>
                  <strong>Cart</strong>

                  <span>
                    View and manage cart
                  </span>
                </div>

                <ChevronRight size={18} />

              </Link>

            </div>

          </div>


          {/* Recent Orders */}

          <div className="account-section">

            <div className="account-section-header">

              <div>
                <h2>Recent Orders</h2>
              </div>

              <Link
                to="/orders"
                className="account-view-all"
              >
                View All
                <ChevronRight size={16} />
              </Link>

            </div>


            <div className="recent-order">

              <div className="recent-order-image">

                <img
                  src="/src/assets/products/dupatta.jpg"
                  alt="Handwoven Cotton Dupatta"
                />

              </div>


              <div className="recent-order-info">

                <strong>
                  Handwoven Cotton Dupatta
                </strong>

                <span>
                  Order #CC1024
                </span>

                <span>
                  Ordered on 24 Aug 2026
                </span>

              </div>


              <div className="recent-order-status">

                <span className="status-badge">
                  Delivered
                </span>

                <strong>
                  ₹899
                </strong>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Account;