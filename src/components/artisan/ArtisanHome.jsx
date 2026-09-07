import { useState } from "react";
import {
  Plus,
  Package,
  ShoppingBag,
  UserRound,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import VoiceGuide from "../../components/artisan/VoiceGuide";

import "./ArtisanHome.css";

function ArtisanHome() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  return (
    <main
      className={`artisan-home ${
        isVoiceActive ? "voice-guidance-active" : ""
      }`}
    >

      {/* ================= HEADER ================= */}

      <header className="artisan-home-header">

        <div className="artisan-home-header-container">

          <Link
            to="/artisan"
            className="artisan-home-logo"
          >
            Hunar<span>Bazaar</span>
          </Link>


          <nav className="artisan-home-nav">

            <div className="artisan-home-nav-links">

              <Link to="/artisan/products">
                My Products
              </Link>

              <Link to="/artisan/orders">
                Orders
              </Link>

            </div>

            <Link to="/artisan/profile">
              <UserRound size={17} />
            </Link>

          </nav>

        </div>

      </header>


      {/* ================= CONTENT ================= */}

      <section className="artisan-home-content">

        <div className="artisan-home-container">


          {/* Greeting */}

          <div className="artisan-greeting">

            <h1>
              Namaste, Meera 👋
            </h1>

          </div>


          {/* ================= GUIDANCE + TARGET ================= */}

          <div className="artisan-guidance-stage">

            <VoiceGuide
              message="Namaste Meera. Welcome to Hoonar Bazaar. Here, You can sell products, see your product listings, check your orders, or view your profile. To sell something you have made, choose Add Product."
              onSpeakingChange={setIsVoiceActive}
            />


            {/* ================= ADD PRODUCT ================= */}

            <Link
              to="/artisan/add-product"
              className="artisan-add-product-card"
            >

              <div className="artisan-add-icon">
                <Plus size={30} />
              </div>

              <div className="artisan-add-content">

                <h2>
                  Add a Product
                </h2>

              </div>

              <ChevronRight
                className="artisan-card-arrow"
                size={22}
              />

            </Link>

          </div>


          {/* ================= QUICK ACTIONS ================= */}

          <div className="artisan-quick-actions">

            <Link
              to="/artisan/products"
              className="artisan-quick-card"
            >

              <div className="artisan-quick-icon">
                <Package size={21} />
              </div>

              <div>

                <span>
                  My Products
                </span>

                <strong>
                  12
                </strong>

                <small>
                  Products listed
                </small>

              </div>

              <ChevronRight size={18} />

            </Link>


            <Link
              to="/artisan/orders"
              className="artisan-quick-card"
            >

              <div className="artisan-quick-icon">
                <ShoppingBag size={21} />
              </div>

              <div>

                <span>
                  Orders
                </span>

                <strong>
                  4
                </strong>

                <small>
                  Orders received
                </small>

              </div>

              <ChevronRight size={18} />

            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default ArtisanHome;