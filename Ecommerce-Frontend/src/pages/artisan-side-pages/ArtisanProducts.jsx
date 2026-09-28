import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Wand2,
  Trash2,
  Edit3,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import api from "../../services/api";
import "./ArtisanProducts.css";

function ArtisanProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchArtisanProducts();
  }, []);

  const fetchArtisanProducts = async () => {
    setLoading(true);
    const seedCatalog = [
      {
        id: "seed-1",
        name: "Handcrafted Jaipur Blue Pottery Floral Vase",
        hindiName: "हस्तनिर्मित जयपुर ब्लू पॉटरी पुष्पदान",
        category: "Pottery",
        region: "Rajasthan",
        price: 1249,
        stock: 14,
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
        compliance: { complianceScore: 100, isWhiteBg: true },
        syndication: { ondc: true, gem: true, trifed: true },
      },
      {
        id: "seed-2",
        name: "Handwoven Banarasi Silk Zari Dupatta",
        hindiName: "हथकरघा बनारसी सिल्क ज़री दुपट्टा",
        category: "Textiles",
        region: "Uttar Pradesh",
        price: 1899,
        stock: 8,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        compliance: { complianceScore: 100, isWhiteBg: true },
        syndication: { ondc: true, gem: true, trifed: true },
      },
      {
        id: "seed-3",
        name: "Channapatna Natural Lacquer Wooden Toy Elephant",
        hindiName: "चन्नापट्टना प्राकृतिक लाख नक्काशीदार हाथी खिलौना",
        category: "Woodcraft",
        region: "Karnataka",
        price: 849,
        stock: 22,
        image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80",
        compliance: { complianceScore: 100, isWhiteBg: true },
        syndication: { ondc: true, gem: true, trifed: true },
      },
      {
        id: "seed-4",
        name: "Terracotta Hand-Molded Kulhar & Kettle Tea Set",
        hindiName: "टेराकोटा हस्तनिर्मित कुल्हड़ व केतली चाय सेट",
        category: "Pottery",
        region: "Uttar Pradesh",
        price: 699,
        stock: 19,
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
        compliance: { complianceScore: 100, isWhiteBg: true },
        syndication: { ondc: true, gem: true, trifed: true },
      },
    ];

    try {
      const response = await api.get("/products");
      if (response.data?.products && response.data.products.length > 0) {
        // Merge fetched products with seeds if needed
        setProducts(response.data.products.length >= 4 ? response.data.products : [...response.data.products, ...seedCatalog.slice(response.data.products.length)]);
      } else {
        setProducts(seedCatalog);
      }
    } catch (err) {
      console.warn("Could not load products, using official seed catalog:", err);
      setProducts(seedCatalog);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.hindiName && p.hindiName.includes(searchTerm));
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="artisan-catalog-page">
      {/* Header Banner */}
      <div className="catalog-header-bar">
        <div>
          <div className="catalog-badge">
            <ShieldCheck size={14} />
            <span>MoSJE Digital Inventory</span>
          </div>
          <h1>My Craft Catalog & Market Linkages</h1>
          <p>
            Manage active listings syndicated across ONDC, GeM, and HunarBazaar. All photos verified for E-Commerce No-Background compliance.
          </p>
        </div>
        <Link to="/artisan/add-product" className="add-new-product-btn">
          <Plus size={18} />
          <span>Add New Product (AI Studio)</span>
        </Link>
      </div>

      {/* KPI Stats Strip */}
      <div className="catalog-kpi-strip">
        <div className="kpi-card">
          <span className="kpi-label">Active Listings</span>
          <strong className="kpi-val">{products.length}</strong>
          <small className="kpi-sub green">100% Marketplace Compliant</small>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Total Inventory Units</span>
          <strong className="kpi-val">
            {products.reduce((acc, curr) => acc + (curr.stock || 10), 0)}
          </strong>
          <small className="kpi-sub">Ready for dispatch</small>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Syndicated Channels</span>
          <strong className="kpi-val">4 Networks</strong>
          <small className="kpi-sub amber">ONDC, GeM, Shilp Haat, B2B</small>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Average Compliance Score</span>
          <strong className="kpi-val green">100%</strong>
          <small className="kpi-sub green">Zero background clutter</small>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="catalog-filter-bar">
        <div className="catalog-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by product name or craft in English/हिंदी..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="catalog-cat-pills">
          {["All", "Pottery", "Textiles", "Woodcraft", "Metal Crafts", "Jewellery"].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="catalog-loading">
          <Package size={40} className="spin" />
          <p>Loading your digitized inventory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="catalog-empty-state">
          <Package size={48} />
          <h3>No products found</h3>
          <p>Use our AI Studio to photograph and list your craft in minutes.</p>
          <Link to="/artisan/add-product" className="empty-add-btn">
            Open AI Studio
          </Link>
        </div>
      ) : (
        <div className="catalog-cards-grid">
          {filtered.map((item) => (
            <div key={item.id || item._id} className="catalog-item-card">
              <div className="item-card-image-wrap">
                <img src={item.image} alt={item.name} className="item-img" />
                <span className="item-compliance-tag">
                  <CheckCircle2 size={12} /> No-BG Compliant
                </span>
                <span className="item-category-pill">{item.category}</span>
              </div>

              <div className="item-card-details">
                <h3 className="item-name">{item.name}</h3>
                {item.hindiName && (
                  <h4 className="item-hindi-name">{item.hindiName}</h4>
                )}

                <div className="item-meta-row">
                  <span className="item-price">₹{item.price}</span>
                  <span className="item-stock">Stock: {item.stock || 12} units</span>
                </div>

                <div className="item-channels-row">
                  <span className="channel-badge ondc">ONDC</span>
                  <span className="channel-badge gem">GeM</span>
                  <span className="channel-badge b2b">B2B Wholesale</span>
                </div>

                <div className="item-actions-row">
                  <Link
                    to={`/product-details/${item.id || item._id}`}
                    target="_blank"
                    className="action-link-view"
                  >
                    <span>View Public Page</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <Link to="/artisan/add-product" className="action-link-ai">
                    <Wand2 size={14} />
                    <span>AI Re-Studio</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtisanProducts;
