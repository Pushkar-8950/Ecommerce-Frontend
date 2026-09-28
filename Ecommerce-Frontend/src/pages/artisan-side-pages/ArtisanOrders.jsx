import { useState } from "react";
import {
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Building2,
  Truck,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import "./ArtisanOrders.css";

function ArtisanOrders() {
  const [activeTab, setActiveTab] = useState("all");
  const [notification, setNotification] = useState("");

  const initialOrders = [
    {
      id: "ORD-MOSJE-2026-891",
      buyer: "Ministry of Social Justice and Empowerment (MoSJE)",
      type: "Government / B2B Bulk Procurement",
      items: "Jaipur Blue Pottery Floral Vases (Set of 40)",
      totalAmount: 49960,
      fairWagePayout: 19200,
      dbtStatus: "Settled via DBT (SBI Jan Dhan A/c ...4819)",
      status: "Delivered",
      date: "Sep 22, 2026",
      badgeClass: "badge-green",
    },
    {
      id: "ORD-ONDC-2026-319",
      buyer: "Vikram Sharma (Bangalore via Mystore Buyer App)",
      type: "ONDC Retail Order",
      items: "Handcrafted Terracotta Tea Set (Set of 6)",
      totalAmount: 1299,
      fairWagePayout: 600,
      dbtStatus: "Direct Transfer Ready",
      status: "Shipped",
      date: "Sep 25, 2026",
      badgeClass: "badge-blue",
    },
    {
      id: "ORD-CORP-2026-104",
      buyer: "Surajkund Crafts Council Gifting Committee",
      type: "Exhibition Corporate Bulk Inquiry",
      items: "Handwoven Banarasi Silk Dupattas (25 Pieces)",
      totalAmount: 47475,
      fairWagePayout: 18000,
      dbtStatus: "Advance 50% DBT Paid",
      status: "In Production",
      date: "Sep 24, 2026",
      badgeClass: "badge-amber",
    },
    {
      id: "ORD-RETAIL-2026-058",
      buyer: "Ananya Deshmukh (Pune via HunarBazaar)",
      type: "Direct Marketplace Retail",
      items: "Pure Bell-Metal Brass Diya Set",
      totalAmount: 599,
      fairWagePayout: 250,
      dbtStatus: "Payment Verified",
      status: "New Order",
      date: "Sep 26, 2026",
      badgeClass: "badge-purple",
    },
  ];

  const [ordersList, setOrdersList] = useState(initialOrders);

  const handleAdvanceStatus = (orderId) => {
    setOrdersList((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (ord.status === "New Order") {
            return { ...ord, status: "In Production", badgeClass: "badge-amber" };
          }
          if (ord.status === "In Production") {
            return { ...ord, status: "Shipped", badgeClass: "badge-blue", dbtStatus: "Dispatched via ONDC Logistics" };
          }
          if (ord.status === "Shipped") {
            return { ...ord, status: "Delivered", badgeClass: "badge-green", dbtStatus: "Settled via DBT (SBI Jan Dhan A/c ...4819)" };
          }
        }
        return ord;
      })
    );
    setNotification(`Order #${orderId} status advanced successfully!`);
    setTimeout(() => setNotification(""), 3500);
  };

  const handlePrintSlip = (orderId) => {
    setNotification(`🖨️ Dispatch label & ONDC barcode for #${orderId} sent to printer!`);
    setTimeout(() => setNotification(""), 3500);
  };

  const filteredOrders = ordersList.filter((o) => {
    if (activeTab === "all") return true;
    if (activeTab === "b2b") return o.type.includes("B2B") || o.type.includes("Bulk") || o.type.includes("Government");
    if (activeTab === "retail") return o.type.includes("Retail");
    if (activeTab === "settled") return o.status === "Delivered";
    return true;
  });

  return (
    <div className="artisan-orders-page">
      {/* Header */}
      <div className="orders-header">
        <div>
          <span className="orders-badge">
            <Building2 size={14} />
            <span>MoSJE Market Linkage & Orders</span>
          </span>
          <h1>Orders & B2B Institutional Demand</h1>
          <p>
            Track retail purchases from ONDC and institutional bulk purchase orders from MoSJE, PSUs, and corporate exhibitions.
          </p>
        </div>
      </div>

      {notification && (
        <div className="orders-notification-banner">
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Financial Payout Strip (DBT - Direct Benefit Transfer) */}
      <div className="dbt-summary-strip">
        <div className="dbt-card card-earnings">
          <div className="dbt-card-header">
            <CreditCard size={18} />
            <span>Total DBT Artisan Earnings</span>
          </div>
          <strong className="dbt-amount">₹99,334</strong>
          <small className="dbt-note">100% Direct Benefit Transfer to bank account</small>
        </div>

        <div className="dbt-card card-wages">
          <div className="dbt-card-header">
            <TrendingUp size={18} />
            <span>Guaranteed Fair Wages Earned</span>
          </div>
          <strong className="dbt-amount green">₹38,050</strong>
          <small className="dbt-note">Calculated at ₹120/hr dignity living wage</small>
        </div>

        <div className="dbt-card card-volume">
          <div className="dbt-card-header">
            <Building2 size={18} />
            <span>B2B Institutional Volume</span>
          </div>
          <strong className="dbt-amount amber">65 Units</strong>
          <small className="dbt-note">Ministry of Social Justice & Surajkund Mela</small>
        </div>
      </div>

      {/* Orders Filter Tabs */}
      <div className="orders-filter-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Orders ({ordersList.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "b2b" ? "active" : ""}`}
          onClick={() => setActiveTab("b2b")}
        >
          B2B & Government Bulk
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "retail" ? "active" : ""}`}
          onClick={() => setActiveTab("retail")}
        >
          ONDC Retail
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "settled" ? "active" : ""}`}
          onClick={() => setActiveTab("settled")}
        >
          Completed & Paid
        </button>
      </div>

      {/* Orders List */}
      <div className="orders-table-card">
        {filteredOrders.map((ord) => (
          <div key={ord.id} className="order-row-item">
            <div className="order-main-info">
              <div className="order-top-line">
                <span className="order-id">{ord.id}</span>
                <span className={`order-status-pill ${ord.badgeClass}`}>{ord.status}</span>
                <span className="order-date">{ord.date}</span>
              </div>
              <h3 className="order-buyer">{ord.buyer}</h3>
              <p className="order-items">{ord.items}</p>
              <div className="order-type-chip">{ord.type}</div>
            </div>

            <div className="order-financials">
              <span className="order-total-amount">₹{ord.totalAmount.toLocaleString()}</span>
              <span className="order-fairwage">
                Fair Wage: <strong>₹{ord.fairWagePayout.toLocaleString()}</strong>
              </span>
              <span className="order-dbt-status">
                <CheckCircle2 size={13} className="dbt-check" />
                {ord.dbtStatus}
              </span>

              <div className="order-actions-bar">
                {ord.status !== "Delivered" && (
                  <button
                    type="button"
                    className="order-btn-advance"
                    onClick={() => handleAdvanceStatus(ord.id)}
                  >
                    Advance Status →
                  </button>
                )}
                <button
                  type="button"
                  className="order-btn-slip"
                  onClick={() => handlePrintSlip(ord.id)}
                >
                  <Truck size={13} />
                  <span>Dispatch Slip</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtisanOrders;
