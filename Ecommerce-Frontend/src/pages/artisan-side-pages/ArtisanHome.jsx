import { useState } from "react";
import {
  Plus,
  Package,
  ShoppingBag,
  UserRound,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Volume2,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import VoiceGuide from "../../components/artisan-side-component/VoiceGuide";
import { useAuth } from "../../context/AuthContext";
import "./ArtisanHome.css";

function ArtisanHome() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [speakTrigger, setSpeakTrigger] = useState(0);
  const { user } = useAuth();

  const artisanDisplayName = user?.name ? user.name.trim().split(" ")[0] : "Artisan";

  return (
    <main className={`artisan-home ${isVoiceActive ? "voice-guidance-active" : ""}`}>
      <div className="artisan-home-container">
        {/* MoSJE Heritage Banner */}
        <div className="artisan-mosje-banner">
          <div className="mosje-banner-content">
            <div className="gov-tag-row">
              <span className="gov-tag">
                <ShieldCheck size={14} />
                Ministry of Social Justice and Empowerment (MoSJE)
              </span>
              <span className="samagam-tag">Shilp Samagam & Surajkund Mela Linkage</span>
            </div>
            <h2>AI-Driven Market Linkage & Smart Cataloging Portal</h2>
            <p>
              Year-round digital marketplace connectivity for marginalized artisans, micro-entrepreneurs, and weavers across India.
            </p>
          </div>
        </div>

        {/* Greeting & Header */}
        <div className="artisan-greeting-section">
          <div className="greeting-text-wrap">
            <h1>Namaste, {artisanDisplayName} 👋</h1>
            <p>Ready to digitize and sell your handcrafted creations today?</p>
          </div>
          <button
            type="button"
            className="artisan-replay-voice-btn"
            onClick={() => setSpeakTrigger((prev) => prev + 1)}
            title="Replay Voice Guidance in Hindi"
          >
            <RotateCcw size={16} />
            <span>Replay Voice Guide / निर्देश सुनें</span>
          </button>
        </div>

        {/* Voice Guidance Banner */}
        <div className="artisan-voice-wrapper">
          <VoiceGuide
            message={`Namaste ${artisanDisplayName}. Welcome to Hunar Bazaar. Here, you can sell products, see your product listings, check your orders, or view your profile. To sell something you have made, choose Add Product.`}
            onSpeakingChange={setIsVoiceActive}
            speakTrigger={speakTrigger}
          />
        </div>

        {/* Hero Card: Add a Product with AI Studio */}
        <div className="artisan-primary-action-wrap">
          <Link to="/artisan/add-product" className="artisan-hero-add-card">
            <div className="hero-add-left">
              <div className="hero-add-icon-ring">
                <Plus size={32} />
              </div>
              <div className="hero-add-text">
                <div className="hero-badge-row">
                  <span className="ai-studio-pill">
                    <Sparkles size={13} />
                    AI Smart Catalog Studio
                  </span>
                  <span className="compliance-pill">No-Background Policy Compliant</span>
                </div>
                <h2>Add a New Product / नया उत्पाद जोड़ें</h2>
                <p>
                  Photograph on your phone → AI automatically removes messy workshop backgrounds → Voice describe in your language → One-click listing to ONDC & GeM.
                </p>
              </div>
            </div>
            <div className="hero-add-cta">
              <span className="cta-label">Open Studio</span>
              <div className="cta-arrow-circle">
                <ChevronRight size={22} />
              </div>
            </div>
          </Link>
        </div>

        {/* 4-Card Quick Actions Grid */}
        <div className="artisan-dashboard-grid">
          {/* Card 1: Products */}
          <Link to="/artisan/products" className="artisan-grid-card card-products">
            <div className="grid-card-icon-wrap">
              <Package size={22} />
            </div>
            <div className="grid-card-content">
              <span className="grid-card-tag">My Inventory</span>
              <strong className="grid-card-stat">12 Products</strong>
              <small className="grid-card-desc">Active listings across ONDC & GeM</small>
            </div>
            <ChevronRight size={18} className="grid-card-arrow" />
          </Link>

          {/* Card 2: Orders */}
          <Link to="/artisan/orders" className="artisan-grid-card card-orders">
            <div className="grid-card-icon-wrap">
              <ShoppingBag size={22} />
            </div>
            <div className="grid-card-content">
              <span className="grid-card-tag">Orders & Demand</span>
              <strong className="grid-card-stat">4 Orders</strong>
              <small className="grid-card-desc">₹99,334 Total DBT Payout</small>
            </div>
            <ChevronRight size={18} className="grid-card-arrow" />
          </Link>

          {/* Card 3: Pehchan Digital ID */}
          <Link to="/artisan/profile" className="artisan-grid-card card-pehchan">
            <div className="grid-card-icon-wrap">
              <UserRound size={22} />
            </div>
            <div className="grid-card-content">
              <span className="grid-card-tag">Digital Pehchan</span>
              <strong className="grid-card-stat">MoSJE Verified</strong>
              <small className="grid-card-desc">Govt. Certified QR Smart Card</small>
            </div>
            <ChevronRight size={18} className="grid-card-arrow" />
          </Link>

          {/* Card 4: Fair Wage Status */}
          <Link to="/artisan/orders" className="artisan-grid-card card-earnings">
            <div className="grid-card-icon-wrap">
              <TrendingUp size={22} />
            </div>
            <div className="grid-card-content">
              <span className="grid-card-tag">Fair Living Wage</span>
              <strong className="grid-card-stat">₹38,050 Earned</strong>
              <small className="grid-card-desc">Guaranteed ₹120/hr dignity wage</small>
            </div>
            <ChevronRight size={18} className="grid-card-arrow" />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ArtisanHome;