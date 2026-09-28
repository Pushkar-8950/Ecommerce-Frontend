import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  PlusCircle,
  Package,
  ShoppingBag,
  UserCheck,
  Globe,
  ExternalLink,
  Volume2,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./ArtisanNavbar.css";

function ArtisanNavbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const artisanName = user?.name ? user.name.trim().split(" ")[0] : "Artisan";

  const navLinks = [
    { path: "/artisan", label: "Dashboard", labelHi: "डैशबोर्ड", icon: <Globe size={18} /> },
    { path: "/artisan/add-product", label: "Add Product (AI Studio)", labelHi: "उत्पाद जोड़ें", icon: <PlusCircle size={18} />, highlight: true },
    { path: "/artisan/products", label: "My Catalog", labelHi: "मेरे उत्पाद", icon: <Package size={18} /> },
    { path: "/artisan/orders", label: "Orders & B2B", labelHi: "आर्डर व थोक मांग", icon: <ShoppingBag size={18} /> },
    { path: "/artisan/profile", label: "Pehchan Card", labelHi: "पहचान पत्र", icon: <UserCheck size={18} /> },
  ];

  const handleVoiceHelp = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      "नमस्ते। यह हुनर बाज़ार शिल्पकार पोर्टल है। यहाँ आप एआई स्टूडियो से बिना बैकग्राउंड वाली फ़ोटो बनाकर नया उत्पाद जोड़ सकते हैं, अपनी बिक्री देख सकते हैं, और ओएनडीसी व जीईएम पर सीधे बेच सकते हैं।"
    );
    utterance.lang = "hi-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <header className="artisan-navbar">
      <div className="artisan-navbar-container">
        {/* Brand & MoSJE Endorsement */}
        <div className="artisan-nav-brand-group">
          <Link to="/artisan" className="artisan-brand-logo">
            <span className="brand-accent">Hunar</span>Bazaar
            <span className="artisan-portal-tag">Artisan Studio</span>
          </Link>
          <div className="mosje-endorsement-pill" title="Ministry of Social Justice and Empowerment Initiative">
            <span className="mosje-dot"></span>
            <span>MoSJE • Shilp Samagam Verified</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="artisan-desktop-nav">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`artisan-nav-item ${isActive ? "active" : ""} ${
                  link.highlight ? "highlight-item" : ""
                }`}
              >
                <span className="nav-icon-wrap">{link.icon}</span>
                <span className="nav-label-wrap">{link.label}</span>
                {link.highlight && (
                  <span className="ai-badge">
                    <Sparkles size={11} />
                    <span>AI</span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="artisan-nav-actions">
          {/* Quick Voice Audio Help */}
          <button
            type="button"
            className="artisan-voice-btn"
            onClick={handleVoiceHelp}
            title="आवाज़ से निर्देश सुनें (Listen Voice Guide in Hindi)"
            aria-label="Voice assistance"
          >
            <Volume2 size={18} />
            <span className="voice-btn-text">Voice Guide</span>
          </button>

          {/* Switch to Buyer View */}
          <Link to="/explore" className="artisan-store-view-btn" target="_blank" rel="noreferrer">
            <span>Marketplace</span>
            <ExternalLink size={14} />
          </Link>

          {/* Profile Quick Pill */}
          <Link to="/artisan/profile" className="artisan-profile-chip">
            <div className="artisan-avatar-sm">{artisanName.charAt(0).toUpperCase()}</div>
            <div className="artisan-chip-text">
              <span className="artisan-chip-name">{artisanName}</span>
              <span className="artisan-chip-role">MoSJE Pehchan</span>
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="artisan-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="artisan-mobile-menu">
          <div className="artisan-mobile-welcome">
            <p>Namaste, <strong>{artisanName}</strong></p>
            <span className="artisan-mobile-tag">Verified MoSJE Artisan</span>
          </div>
          <div className="artisan-mobile-links">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`artisan-mobile-item ${isActive ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  <div className="mobile-item-labels">
                    <span className="mobile-label-en">{link.label}</span>
                    <span className="mobile-label-hi">{link.labelHi}</span>
                  </div>
                  {link.highlight && <span className="ai-badge-sm">AI Studio</span>}
                </Link>
              );
            })}
          </div>
          <div className="artisan-mobile-actions">
            <button type="button" className="artisan-mobile-voice-btn" onClick={handleVoiceHelp}>
              <Volume2 size={18} />
              <span>आवाज़ से निर्देश सुनें (Voice Guide)</span>
            </button>
            <Link to="/explore" className="artisan-mobile-store-link" onClick={() => setMobileMenuOpen(false)}>
              Browse Public Marketplace <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default ArtisanNavbar;