import {
  Package,
  Search,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import { Link } from "react-router-dom";
import "./Orders.css";

const orders = [
  {
    id: "CC1024",
    date: "24 Aug 2026",
    status: "Delivered",
    statusType: "delivered",
    product: "Handwoven Cotton Dupatta",
    artisan: "Meera Handlooms",
    category: "Textiles",
    price: 899,
    quantity: 1,
    image: "/src/assets/products/dupatta.jpg",
  },

  {
    id: "CC1017",
    date: "28 Aug 2026",
    status: "In Transit",
    statusType: "transit",
    product: "Blue Pottery Vase",
    artisan: "Jaipur Crafts",
    category: "Pottery",
    price: 1249,
    quantity: 1,
    image: "/src/assets/products/vase.jpg",
  },

  {
    id: "CC1009",
    date: "18 Aug 2026",
    status: "Cancelled",
    statusType: "cancelled",
    product: "Traditional Brass Diya Set",
    artisan: "Kashi Metalworks",
    category: "Metal Crafts",
    price: 599,
    quantity: 1,
    image: "/src/assets/products/diya.jpg",
  },
];

function Orders() {
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
            />

          </div>


          <select className="orders-filter">

            <option>All Orders</option>
            <option>Delivered</option>
            <option>In Transit</option>
            <option>Cancelled</option>

          </select>

        </div>


        {/* ================= ORDER LIST ================= */}

        <section className="orders-list">

          {orders.map((order) => (

            <article
              className="order-card"
              key={order.id}
            >

              {/* Order Header */}

              <div className="order-card-header">

                <div>

                  <span className="order-label">
                    ORDER
                  </span>

                  <strong>
                    #{order.id}
                  </strong>

                  <span className="order-date">
                    Placed on {order.date}
                  </span>

                </div>


                <span
                  className={`order-status ${order.statusType}`}
                >
                  {order.status}
                </span>

              </div>


              {/* Product */}

              <div className="order-product">

                <Link
                  to="/product/1"
                  className="order-product-image"
                >

                  <img
                    src={order.image}
                    alt={order.product}
                  />

                </Link>


                <div className="order-product-info">

                  <span className="order-category">
                    {order.category}
                  </span>

                  <Link
                    to="/product/1"
                    className="order-product-name"
                  >
                    {order.product}
                  </Link>

                  <span className="order-artisan">
                    by {order.artisan}
                  </span>

                  <span className="order-quantity">
                    Quantity: {order.quantity}
                  </span>

                </div>


                <div className="order-product-price">

                  <span>Total</span>

                  <strong>
                    ₹{order.price.toLocaleString()}
                  </strong>

                </div>

              </div>


              {/* Actions */}

              <div className="order-card-footer">

                <div className="order-status-message">

                  {order.statusType === "delivered" && (
                    <>
                      <span className="status-dot delivered-dot" />
                      Delivered successfully
                    </>
                  )}

                  {order.statusType === "transit" && (
                    <>
                      <span className="status-dot transit-dot" />
                      Your order is on its way
                    </>
                  )}

                  {order.statusType === "cancelled" && (
                    <>
                      <span className="status-dot cancelled-dot" />
                      This order was cancelled
                    </>
                  )}

                </div>


                <div className="order-actions">

                  {order.statusType === "delivered" && (
                    <button className="order-action-btn">
                      <RotateCcw size={15} />
                      Buy Again
                    </button>
                  )}

                  {order.statusType === "transit" && (
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

          ))}

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