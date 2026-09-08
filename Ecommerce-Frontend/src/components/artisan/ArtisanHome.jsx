import { useState } from "react";
import {
  Plus,
  Package,
  ShoppingBag,
  UserRound,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import { Link } from "react-router-dom";
import VoiceGuide from "../../components/artisan/VoiceGuide";
import { useAuth } from "../../context/AuthContext";

import "./ArtisanHome.css";

function ArtisanHome() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [speakTrigger, setSpeakTrigger] = useState(0);
  const { user } = useAuth();

  const artisanDisplayName = user?.name ? user.name.trim().split(" ")[0] : "Artisan";

  return (
    <main
      className={`artisan-home ${
        isVoiceActive ? "voice-guidance-active" : ""
      }`}
    >
      {/* =========================
          HEADER
      ========================= */}

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


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <section className="artisan-home-content">

        <div className="artisan-home-container">


          {/* =========================
              GREETING
          ========================= */}

          <div className="artisan-greeting">

            <h1>
              Namaste, {artisanDisplayName} 👋
            </h1>

          </div>


          {/* =========================
              GUIDANCE + TARGET
          ========================= */}

          <div className="artisan-guidance-stage">

            <VoiceGuide
              message={`Namaste ${artisanDisplayName}. Welcome to Hunar Bazaar. Here, you can sell products, see your product listings, check your orders, or view your profile. To sell something you have made, choose Add Product.`}
              onSpeakingChange={setIsVoiceActive}
              speakTrigger={speakTrigger}
            />


            {/* =========================
                ADD PRODUCT
            ========================= */}

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

            {!isVoiceActive && (
                <button
                  className="artisan-hear-again-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setSpeakTrigger(prev => prev + 1);
                  }}
                  aria-label="Hear instruction again"
                >
                  <RotateCcw size={22} />
                </button>
              )}

          </div>


          {/* =========================
              QUICK ACTIONS
          ========================= */}

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