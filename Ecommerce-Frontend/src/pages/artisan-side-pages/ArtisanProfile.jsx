import { useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Award,
  CreditCard,
  Volume2,
  MapPin,
  CheckCircle2,
  Calendar,
  Languages,
  QrCode,
  Download,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./ArtisanProfile.css";

function ArtisanProfile() {
  const { user } = useAuth();
  const [voiceSpeed, setVoiceSpeed] = useState("normal");
  const [preferredLang, setPreferredLang] = useState("hi-IN");

  const artisanName = user?.name || "Ramdev Kumhar";

  return (
    <div className="artisan-profile-page">
      {/* Header */}
      <div className="profile-header-banner">
        <div className="profile-hero-meta">
          <div className="profile-avatar-large">
            {artisanName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="mosje-verified-badge">
              <ShieldCheck size={16} />
              <span>MoSJE Pehchan Verified Artisan</span>
            </div>
            <h1>{artisanName}</h1>
            <p className="artisan-heritage-cluster">
              <MapPin size={16} />
              <span>Jaipur Pottery Craft Cluster • Rajasthan</span>
            </p>
          </div>
        </div>
      </div>

      <div className="profile-grid-layout">
        {/* LEFT COLUMN: OFFICIAL DIGITAL PEHCHAN CARD */}
        <div className="digital-pehchan-card-wrapper">
          <div className="digital-card-label">
            <span>Official Government Digital Identity Card</span>
          </div>

          <div className="digital-id-card">
            <div className="id-card-top">
              <div className="emblem-group">
                <span className="gov-title">Government of India • MoSJE</span>
                <span className="sub-dept">Department of Social Justice and Empowerment</span>
              </div>
              <span className="pehchan-stamp">PEHCHAN</span>
            </div>

            <div className="id-card-body">
              <div className="id-artisan-photo">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
                  alt={artisanName}
                  className="artisan-id-img"
                />
                <span className="photo-verified-pin">✓</span>
              </div>
              <div className="id-artisan-details">
                <span className="id-field-label">Artisan Name / शिल्पकार:</span>
                <strong className="id-field-val">{artisanName}</strong>

                <span className="id-field-label">Pehchan Card ID:</span>
                <strong className="id-field-val mono">MOSJE-ART-2026-9214</strong>

                <span className="id-field-label">Craft Specialty:</span>
                <strong className="id-field-val">Traditional Blue Pottery & Terracotta</strong>

                <span className="id-field-label">Cluster Region:</span>
                <strong className="id-field-val">Sanganer Cluster, Jaipur, Rajasthan</strong>
              </div>
            </div>

            <div className="id-card-footer">
              <div className="qr-box">
                <QrCode size={48} />
              </div>
              <div className="verification-text">
                <span className="verified-line">
                  <CheckCircle2 size={13} className="green" /> Authenticated on National Artisan Portal
                </span>
                <span className="dbt-line">DBT Enabled • Shilp Samagam Beneficiary</span>
              </div>
            </div>
          </div>

          <div className="id-card-actions">
            <button
              type="button"
              className="id-action-btn download"
              onClick={() => alert("Pehchan Smart Card PDF generated successfully!")}
            >
              <Download size={16} />
              <span>Download Digital ID (PDF)</span>
            </button>
            <button
              type="button"
              className="id-action-btn print"
              onClick={() => window.print()}
            >
              <span>Print Smart Card</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RECOGNITION, BANK & VOICE SETTINGS */}
        <div className="profile-settings-col">
          {/* Physical Fair Linkages & Participations */}
          <div className="profile-card">
            <h3>
              <Award size={18} className="card-icon" />
              <span>National Physical Exhibition Record</span>
            </h3>
            <div className="fairs-list">
              <div className="fair-item">
                <Calendar size={16} />
                <div>
                  <strong>Shilp Samagam 2026 (New Delhi)</strong>
                  <p>Ministry of Social Justice and Empowerment Pavilion</p>
                </div>
                <span className="fair-status-pill">Participated</span>
              </div>

              <div className="fair-item">
                <Calendar size={16} />
                <div>
                  <strong>Surajkund International Crafts Mela</strong>
                  <p>Master Craftsperson Stall #B-42</p>
                </div>
                <span className="fair-status-pill">Participated</span>
              </div>

              <div className="fair-item">
                <Calendar size={16} />
                <div>
                  <strong>Dilli Haat (INA Crafts Bazaar)</strong>
                  <p>State Handloom & Handicraft Fortnight</p>
                </div>
                <span className="fair-status-pill">Participated</span>
              </div>
            </div>
          </div>

          {/* Direct Benefit Transfer (DBT) Bank Account */}
          <div className="profile-card">
            <h3>
              <CreditCard size={18} className="card-icon" />
              <span>DBT Bank Account (Direct Benefit Transfer)</span>
            </h3>
            <div className="bank-details-box">
              <div className="bank-row">
                <span>Bank Name:</span>
                <strong>State Bank of India (Jan Dhan Scheme)</strong>
              </div>
              <div className="bank-row">
                <span>Account Number:</span>
                <strong className="mono">XXXX-XXXX-4819</strong>
              </div>
              <div className="bank-row">
                <span>IFSC Code:</span>
                <strong className="mono">SBIN0001248</strong>
              </div>
              <div className="dbt-verified-seal">
                <CheckCircle2 size={14} />
                <span>DBT Aadhaar Seeding Verified by MoSJE</span>
              </div>
            </div>
          </div>

          {/* Voice Assistant & Language Preferences */}
          <div className="profile-card">
            <h3>
              <Volume2 size={18} className="card-icon" />
              <span>Voice Guide & Accessibility Settings</span>
            </h3>
            <div className="voice-prefs-grid">
              <div className="pref-field">
                <label>Preferred Voice Guide Language:</label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                  className="pref-select"
                >
                  <option value="hi-IN">Hindi (हिन्दी)</option>
                  <option value="en-IN">English (Indian)</option>
                  <option value="bn-IN">Bengali (বাংলা)</option>
                  <option value="mr-IN">Marathi (मराठी)</option>
                </select>
              </div>

              <div className="pref-field">
                <label>Speech Speed (बोलने की गति):</label>
                <select
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(e.target.value)}
                  className="pref-select"
                >
                  <option value="slow">Slow & Clear (धीमी व स्पष्ट)</option>
                  <option value="normal">Normal (सामान्य)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtisanProfile;
