import { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Star,
  Heart,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Explore.css";

const categories = [
  "Textiles",
  "Jewellery",
  "Home Decor",
  "Art & Paintings",
  "Pottery",
  "Gifts",
  "Woodcraft",
  "Metal Crafts",
  "Handmade Bags",
];

const regions = [
  "Rajasthan",
  "Haryana",
  "Uttar Pradesh",
  "Gujarat",
  "West Bengal",
];

function Explore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [sortBy, setSortBy] = useState("");

  /**
   * Fetch products dynamically from backend GET /api/products
   * Re-runs whenever categories, regions, or sort criteria change
   */
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construct query parameters matching backend specification
        const params = {};
        if (selectedCategories.length > 0) {
          params.category = selectedCategories.join(",");
        }
        if (selectedRegions.length > 0) {
          params.region = selectedRegions.join(",");
        }
        if (sortBy) {
          params.sort = sortBy;
        }

        const response = await api.get("/products", { params });

        if (isMounted) {
          const items = response.data.products || response.data.data || response.data;
          setProducts(Array.isArray(items) ? items : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching products:", err);
          setError(
            err.response?.data?.message ||
              "Unable to load products. Please check your connection and try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [selectedCategories, selectedRegions, sortBy]);

  // Toggle buttons for selecting categories and regions
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const toggleRegion = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((item) => item !== region)
        : [...prev, region]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSortBy("");
  };

  return (
    <main className="explore-page">
      {/* Heading */}
      <div className="explore-header">
        <div>
          <h1>Explore Crafts</h1>
          <p>
            Discover authentic handcrafted products from artisans across India.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="explore-container">
        {/* Sidebar */}
        <aside className="filter-sidebar">
          <div className="filter-title">
            <SlidersHorizontal size={18} />
            <h3>Filters</h3>
            {(selectedCategories.length > 0 || selectedRegions.length > 0 || sortBy) && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  color: "#d97706",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h4>Categories</h4>
            {categories.map((category) => (
              <label key={category} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

          {/* Region */}
          <div className="filter-section">
            <h4>Region</h4>
            {regions.map((region) => (
              <label key={region} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(region)}
                  onChange={() => toggleRegion(region)}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Products Section */}
        <section className="explore-products">
          <div className="explore-products-top">
            <p>
              Showing <strong>{products.length}</strong> products
            </p>

            <div className="sort-container">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Recommended</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
                color: "#6b7280",
                gap: "12px",
              }}
            >
              <Loader2 size={36} className="spin-animation" style={{ animation: "spin 1s linear infinite" }} />
              <p style={{ fontSize: "16px", fontWeight: 500 }}>Loading artisanal catalog...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "24px",
                margin: "20px 0",
                textAlign: "center",
                color: "#991b1b",
              }}
            >
              <AlertCircle size={32} style={{ margin: "0 auto 8px" }} />
              <p style={{ fontWeight: 600, marginBottom: "12px" }}>{error}</p>
              <button
                type="button"
                onClick={() => {
                  // Trigger reload
                  setLoading(true);
                  setError(null);
                  api.get("/products")
                    .then((res) => setProducts(res.data.products || res.data))
                    .catch((e) => setError(e.message))
                    .finally(() => setLoading(false));
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                <RotateCcw size={16} />
                Retry
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="explore-products-grid">
              {products.map((product) => (
                <div className="explore-product-card" key={product.id || product._id}>
                  <div className="explore-product-image">
                    <img
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                      loading="lazy"
                    />
                    <button className="explore-wishlist" type="button" aria-label="Add to wishlist">
                      <Heart size={18} />
                    </button>
                  </div>

                  <div className="explore-product-info">
                    <span className="explore-category">{product.category}</span>

                    <Link
                      to={`/product/${product.id || product._id}`}
                      className="explore-product-name"
                    >
                      {product.name}
                    </Link>

                    <span className="explore-artisan">by {product.artisan || "Master Artisan"}</span>

                    <div className="explore-rating">
                      <span className="explore-rating-box">
                        {product.rating || 4.8}
                        <Star size={11} fill="currentColor" />
                      </span>
                      <span>({product.reviews || 0})</span>
                    </div>

                    <strong className="explore-price">
                      ₹{Number(product.price || 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try changing your category or regional filters.</p>
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  backgroundColor: "#292524",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Explore;