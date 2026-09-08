import { useState, useEffect } from "react";
import {
  Package,
  Search,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "../services/api";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Orders");

  useEffect(() => {
    let isMounted = true;
    api.get("/orders")
      .then((res) => {
        if (isMounted) {
          if (Array.isArray(res.data?.orders)) {
            setOrders(res.data.orders);
          } else {
            setOrders([]);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not fetch real orders:", err);
        setOrders([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusType = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("deliver")) return "delivered";
    if (s.includes("transit")) return "transit";
    if (s.includes("cancel")) return "cancelled";
    return "transit";
  };

  const filteredOrders = orders.filter((order) => {
    // Status Filter
    if (filterStatus !== "All Orders") {
      const match = (order.status || "").toLowerCase() === filterStatus.toLowerCase();
      if (!match) return false;
    }

    // Search Term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const orderMatch =
        (order.orderNumber || "").toLowerCase().includes(q) ||
        (order.id || "").toLowerCase().includes(q) ||
        (order.status || "").toLowerCase().includes(q);
      const itemsMatch = order.items?.some((i) =>
        (i.name || "").toLowerCase().includes(q)
      );
      return orderMatch || itemsMatch;
    }

    return true;
  });

  return (
    <main className="orders-page">

      {/* ================= HEADER ================= */}

      <div className="orders-header">

        <div className="orders-header-container">

          <div className="orders-title-row">

            <div>
              <h1>My Orders</h1>
            </div>

            <div className="orders-icon">
              <Package size={30} />
            </div>

          </div>

        </div>

      </div>


      {/* ================= CONTENT ================= */}

      <div className="orders-container">

        {/* ================= TOP BAR ================= */}

        <div className="orders-toolbar">

          <div className="orders-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search by order or product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>


          <select
            className="orders-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >

            <option>All Orders</option>
            <option>Pending</option>
            <option>In Transit</option>
            <option>Delivered</option>
            <option>Cancelled</option>

          </select>

        </div>


        {/* ================= ORDER LIST ================= */}

        <section className="orders-list">

          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 16px", color: "#6b7280" }}>
              <Package size={44} style={{ margin: "0 auto 12px", color: "#9ca3af" }} />
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>No orders found.</p>
              <span style={{ fontSize: "14px" }}>
                {orders.length === 0
                  ? "You haven't placed any orders yet."
                  : "No orders match your filter criteria."}
              </span>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusType = getStatusType(order.status);
              const orderNumber =
                order.orderNumber ||
                `ORD-${(order.id || order._id || "").slice(-6).toUpperCase()}`;
              const orderDate =
                order.date ||
                (order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recent");

              const totalAmount =
                order.totalAmount !== undefined
                  ? order.totalAmount
                  : order.total || 0;

              return (
                <article
                  className="order-card"
                  key={order.id || order._id}
                >

                  {/* Order Header */}

                  <div className="order-card-header">

                    <div>

                      <span className="order-label">
                        ORDER
                      </span>

                      <strong>
                        #{orderNumber}
                      </strong>

                      <span className="order-date">
                        Placed on {orderDate}
                      </span>

                    </div>


                    <span
                      className={`order-status ${statusType}`}
                    >
                      {order.status}
                    </span>

                  </div>


                  {/* Products in this order */}

                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div className="order-product" key={idx}>

                        <Link
                          to={`/product/${item.productId || ""}`}
                          className="order-product-image"
                        >
                          <img
                            src={item.image || "/src/assets/products/dupatta.jpg"}
                            alt={item.name}
                          />
                        </Link>


                        <div className="order-product-info">

                          <span className="order-category">
                            Artisan Craft
                          </span>

                          <Link
                            to={`/product/${item.productId || ""}`}
                            className="order-product-name"
                          >
                            {item.name}
                          </Link>

                          <span className="order-quantity">
                            Quantity: {item.quantity}
                          </span>

                        </div>


                        <div className="order-product-price">

                          <span>Item Price</span>

                          <strong>
                            ₹{(Number(item.price) || 0).toLocaleString()}
                          </strong>

                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="order-product">
                      <div className="order-product-info">
                        <span className="order-product-name">{order.product || "Artisan Craft"}</span>
                        <span className="order-quantity">Quantity: {order.quantity || 1}</span>
                      </div>
                      <div className="order-product-price">
                        <strong>₹{(Number(order.price) || 0).toLocaleString()}</strong>
                      </div>
                    </div>
                  )}

                  {/* Order Total Row */}
                  <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>Order Total:</span>
                    <strong style={{ fontSize: "16px", color: "#111827" }}>₹{Number(totalAmount).toLocaleString()}</strong>
                  </div>

                  {/* Actions */}

                  <div className="order-card-footer">

                    <div className="order-status-message">

                      {statusType === "delivered" && (
                        <>
                          <span className="status-dot delivered-dot" />
                          Delivered successfully
                        </>
                      )}

                      {statusType === "transit" && (
                        <>
                          <span className="status-dot transit-dot" />
                          Your order is on its way
                        </>
                      )}

                      {statusType === "cancelled" && (
                        <>
                          <span className="status-dot cancelled-dot" />
                          This order was cancelled
                        </>
                      )}

                    </div>


                    <div className="order-actions">

                      {statusType === "delivered" && (
                        <button className="order-action-btn">
                          <RotateCcw size={15} />
                          Buy Again
                        </button>
                      )}

                      {statusType === "transit" && (
                        <button className="order-action-btn primary">
                          Track Order
                        </button>
                      )}

                      <button className="order-action-btn">
                        View Details
                        <ChevronRight size={15} />
                      </button>

                    </div>

                  </div>

                </article>
              );
            })
          )}

        </section>


        {/* ================= EMPTY CTA ================= */}

        <div className="orders-explore">

          <div>

            <span>
              Looking for something else?
            </span>

            <h2>
              Explore More products
            </h2>

          </div>

          <Link
            to="/explore"
            className="orders-explore-btn"
          >
            Explore Crafts
            <ChevronRight size={17} />
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Orders;