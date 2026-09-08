import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  Package,
  Heart,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import "./Navbar.css";

function Navbar() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Hunar<span>Bazaar</span>
        </Link>

        {/* Categories */}
        <div
          className="navbar-dropdown-wrapper"
          onMouseEnter={() => setCategoriesOpen(true)}
          onMouseLeave={() => setCategoriesOpen(false)}
        >
          <button className="navbar-dropdown-trigger">
            Categories
            <ChevronDown size={16} />
          </button>

          {categoriesOpen && (
            <div className="categories-dropdown">
              <div>
                <h4>Textiles</h4>
                <Link to="/explore?category=sarees">Sarees</Link>
                <Link to="/explore?category=dupattas">Dupattas</Link>
                <Link to="/explore?category=handloom">Handloom</Link>
                <Link to="/explore?category=rugs">Rugs & Carpets</Link>
              </div>

              <div>
                <h4>Handicrafts</h4>
                <Link to="/explore?category=woodcraft">Woodcraft</Link>
                <Link to="/explore?category=pottery">Pottery</Link>
                <Link to="/explore?category=paintings">Paintings</Link>
                <Link to="/explore?category=decor">Home Decor</Link>
              </div>

              <div>
                <h4>Jewellery</h4>
                <Link to="/explore?category=earrings">Earrings</Link>
                <Link to="/explore?category=necklaces">Necklaces</Link>
                <Link to="/explore?category=bangles">Bangles</Link>
                <Link to="/explore?category=traditional">Traditional</Link>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="navbar-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search handicrafts, textiles, jewellery..."
          />
        </div>

        {/* Artisan Portal Header Link */}
        {isAuthenticated && user?.role === "artisan" && (
          <Link
            to="/artisan"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              backgroundColor: "#f59e0b",
              color: "#ffffff",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "13px",
              textDecoration: "none",
              marginRight: "4px",
            }}
          >
            <LayoutDashboard size={16} />
            <span>Artisan Portal</span>
          </Link>
        )}

        {/* Account */}
        <div
          className="navbar-dropdown-wrapper account-wrapper"
          onMouseEnter={() => setAccountOpen(true)}
          onMouseLeave={() => setAccountOpen(false)}
        >
          <button className="navbar-account">
            <User size={19} />

            <div>
              <span className="account-small">
                {isAuthenticated ? `Hello, ${user?.name?.split(' ')[0] || 'Member'}` : 'Hello, Sign in'}
              </span>
              <span className="account-main">
                Account & Lists <ChevronDown size={14} />
              </span>
            </div>
          </button>

          {accountOpen && (
            <div className="account-dropdown">
              <div className="account-dropdown-header">
                {isAuthenticated ? (
                  <div style={{ padding: "4px 0" }}>
                    <p style={{ fontWeight: 600, fontSize: "14px", color: "#111827", margin: 0 }}>
                      {user?.name}
                    </p>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>{user?.email}</span>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="account-signin">
                      Sign in
                    </Link>
                    <p>New customer?</p>
                    <Link to="/register">Create your account</Link>
                  </>
                )}
              </div>

              <div className="account-dropdown-links">
                {isAuthenticated && user?.role === "artisan" && (
                  <Link
                    to="/artisan"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      borderRadius: "6px",
                      fontWeight: 600,
                      marginBottom: "6px",
                      border: "1px solid #fde68a",
                    }}
                  >
                    <LayoutDashboard size={17} />
                    Artisan Dashboard
                  </Link>
                )}

                <Link to="/orders">
                  <Package size={17} />
                  My Orders
                </Link>

                <Link to="/wishlist">
                  <Heart size={17} />
                  Wishlist
                </Link>

                <Link to="/settings">
                  <Settings size={17} />
                  Account Settings
                </Link>

                {isAuthenticated && (
                  <button type="button" onClick={logout} style={{ width: "100%", textAlign: "left" }}>
                    <LogOut size={17} />
                    Sign out
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="navbar-cart">
          <ShoppingCart size={25} />
          <span>Cart</span>
          <span className="cart-count">0</span>
        </Link>

      </div>
    </header>
  );
}

export default Navbar;