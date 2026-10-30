import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { operationsService } from '../../services/operationsService';
import { stationService, EVStation } from '../../services/stationService';
import { OperationsSummary } from '../../types/operations';
import { User } from '../../types/auth';
import { formatCurrencyINR } from '../../utils/dashboardHelpers';
import { NetworkBackground } from './components/NetworkBackground/NetworkBackground';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [summary, setSummary] = useState<OperationsSummary>({
    totalChargers: 80,
    totalZones: 8,
    totalCities: 5,
    availableChargers: 56,
    activeSessions: 14,
    todayRevenueINR: 12480,
    region: 'Andhra Pradesh',
  });
  const [stations, setStations] = useState<EVStation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Interactive Tariff Calculator State
  const [calculatorKWh, setCalculatorKWh] = useState<number>(30);
  const baseRatePerKWh = 18.5;
  const energyCost = calculatorKWh * baseRatePerKWh;
  const gstCost = energyCost * 0.18;
  const totalCost = energyCost + gstCost;
  const estChargingTimeMin = Math.round((calculatorKWh / 60) * 60); // Assuming 60kW DC fast charger

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ops, stList] = await Promise.all([
          operationsService.getOperationsSummary().catch(() => null),
          stationService.getStations().catch(() => []),
        ]);
        if (ops) setSummary(ops);
        if (stList) setStations(stList);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdminQuickLogin = () => {
    const adminUser: User = {
      id: 'usr_super_admin',
      name: 'Super Admin',
      email: 'admin@powergrid.in',
      phoneNumber: '9999999999',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    const token = `pg_admin_tok_${Date.now()}`;
    sessionStorage.setItem('vg_auth_token', token);
    sessionStorage.setItem('vg_user_info', JSON.stringify(adminUser));
    loginUser(adminUser, token);
    navigate('/admin/dashboard');
  };

  const handleCustomerLogin = () => {
    navigate('/login?role=customer');
  };

  const faqs = [
    {
      q: 'How do I add money to my Eway Smart Wallet?',
      a: 'Navigate to your Customer Wallet and select "Add Money". You can choose from presets like ₹100, ₹250, ₹500, ₹1,000, or enter any custom amount. Pay instantly using Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), or Net Banking with verified 0% convenience fees.',
    },
    {
      q: 'Which EV connectors and charging protocols are supported?',
      a: 'The Eway Supergrid features high-speed DC Dual-Gun CCS2 (up to 150 kW), GB/T, and AC Type 2 (up to 22 kW) connectors compatible with Tata, MG, Mahindra, Hyundai, Kia, BMW, and all major Indian EVs.',
    },
    {
      q: 'How do I download GST-compliant tax invoices for commercial fleets?',
      a: 'Every charging session and wallet top-up instantly generates a digital GST Tax Invoice with SAC codes (998714), input tax credits, and breakups. View or print your tax invoice directly from the Wallet transaction ledger or Charging History.',
    },
    {
      q: 'What is the recommended battery charging limit for daily use?',
      a: 'Our AI Range Copilot recommends charging up to 80% SoC for daily commuting. This preserves lithium-ion chemistry longevity while charging at maximum speed. You can configure your automatic cutoff percentage in Account Settings.',
    },
  ];

  return (
    <div className="eway-home">
      {/* Background Ambient Network Graphics */}
      <NetworkBackground />

      {/* 1. TOP FLOATING GLASS NAVIGATION BAR */}
      <header className="eway-home__navbar" role="banner">
        <div className="eway-home__nav-container">
          <div className="eway-home__brand" onClick={() => navigate('/')}>
            <div className="eway-home__brand-logo-wrap">
              <img
                src="/eway-logo.png"
                alt="Eway to Your EVs"
                className="eway-home__brand-logo-img"
              />
            </div>
            <div className="eway-home__brand-names">
              <span className="eway-home__brand-name">Eway to Your EVs</span>
              <span className="eway-home__brand-badge">Supergrid</span>
            </div>
          </div>

          <nav className="eway-home__nav-links" aria-label="Main Navigation">
            <a href="#overview" className="eway-home__nav-link">Overview</a>
            <a href="#network" className="eway-home__nav-link">Network</a>
            <a href="#wallet" className="eway-home__nav-link">Smart Wallet</a>
            <a href="#calculator" className="eway-home__nav-link">Tariffs</a>
            <a href="#faqs" className="eway-home__nav-link">FAQs</a>
          </nav>

          <div className="eway-home__nav-actions">
            <button
              type="button"
              className="eway-home__btn-ops"
              onClick={handleAdminQuickLogin}
              title="Enter Enterprise Operations Center"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Operations Center</span>
            </button>

            <button
              type="button"
              className="eway-home__btn-login"
              onClick={handleCustomerLogin}
            >
              Login
            </button>

            <button
              type="button"
              className="eway-home__btn-cta"
              onClick={handleCustomerLogin}
            >
              <span>Get Started</span>
              <span className="eway-home__btn-arrow">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="eway-hero-section" id="overview">
        <div className="eway-hero-container">
          {/* Left Column: Headline, Description & Metrics */}
          <div className="eway-hero__left">
            <div className="eway-hero__badge" role="status">
              <span className="eway-hero__badge-dot" />
              <span>80+ HIGH-SPEED CHARGING POINTS ACTIVE ACROSS ANDHRA PRADESH</span>
            </div>

            <h1 className="eway-hero__title">
              Your Journey.<br />
              <span className="eway-hero__highlight">Electrified.</span>
            </h1>

            <p className="eway-hero__subtitle">
              Discover a smarter way to power your electric journey with a connected charging experience, instant zero-fee wallet top-ups, and intelligent station routing.
            </p>

            <div className="eway-hero__actions">
              <button
                type="button"
                className="eway-hero__cta-primary"
                onClick={handleCustomerLogin}
              >
                <span>Explore Charging Network</span>
                <span className="eway-hero__cta-arrow">→</span>
              </button>

              <button
                type="button"
                className="eway-hero__cta-secondary"
                onClick={handleAdminQuickLogin}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Admin Operations</span>
              </button>
            </div>

            {/* Network Statistics Bar */}
            <div className="eway-hero__stats">
              <div className="eway-hero__stat-card">
                <span className="eway-hero__stat-num">{isLoading ? '...' : summary.totalChargers}</span>
                <span className="eway-hero__stat-label">Fast Chargers</span>
              </div>
              <div className="eway-hero__stat-divider" />
              <div className="eway-hero__stat-card">
                <span className="eway-hero__stat-num">{isLoading ? '...' : summary.totalZones}</span>
                <span className="eway-hero__stat-label">Power Zones</span>
              </div>
              <div className="eway-hero__stat-divider" />
              <div className="eway-hero__stat-card">
                <span className="eway-hero__stat-num">{isLoading ? '...' : `${summary.totalCities}+`}</span>
                <span className="eway-hero__stat-label">Cities Covered</span>
              </div>
              <div className="eway-hero__stat-divider" />
              <div className="eway-hero__stat-card">
                <span className="eway-hero__stat-num eway-hero__stat-num--lime">99.8%</span>
                <span className="eway-hero__stat-label">Grid Uptime</span>
              </div>
            </div>
          </div>

          {/* Right Column: Next-Gen EV Energy Visual Composition */}
          <div className="eway-hero__right">
            <div className="eway-visual-box">
              {/* Central Glowing Energy Aura */}
              <div className="eway-visual__aura" />

              {/* Holographic Charging Station Representation */}
              <div className="eway-visual__station-pillar">
                <div className="eway-visual__pillar-head">
                  <span className="eway-visual__status-light" />
                  <span className="eway-visual__pillar-title">EWAY DC 120kW</span>
                </div>
                <div className="eway-visual__pillar-screen">
                  <div className="eway-visual__screen-pct">84%</div>
                  <div className="eway-visual__screen-rate">94.2 kW · Fast DC</div>
                </div>
                <div className="eway-visual__cable-flow">
                  <span className="eway-visual__energy-particle" />
                  <span className="eway-visual__energy-particle" />
                </div>
              </div>

              {/* Central EV Silhouette SVG Graphic with neon circuit lines */}
              <div className="eway-visual__ev-card">
                <svg className="eway-visual__ev-svg" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 60 160 C 90 160 110 130 140 100 C 160 80 200 70 250 70 C 290 70 330 90 350 120 L 370 140 C 380 150 380 160 370 165 C 360 170 120 170 60 165 Z"
                    fill="#0B233F"
                    stroke="#12CFEA"
                    strokeWidth="2.5"
                  />
                  {/* Wheel Cutouts */}
                  <circle cx="120" cy="165" r="28" fill="#071B32" stroke="#43D500" strokeWidth="3" />
                  <circle cx="120" cy="165" r="14" fill="#0B233F" stroke="#12CFEA" strokeWidth="1.5" />
                  <circle cx="310" cy="165" r="28" fill="#071B32" stroke="#43D500" strokeWidth="3" />
                  <circle cx="310" cy="165" r="14" fill="#0B233F" stroke="#12CFEA" strokeWidth="1.5" />
                  {/* Cabin Glass */}
                  <path
                    d="M 170 95 L 240 85 C 270 85 295 98 310 115 L 180 115 Z"
                    fill="rgba(18, 207, 234, 0.25)"
                    stroke="#12CFEA"
                    strokeWidth="1.5"
                  />
                  {/* Headlight beam */}
                  <polygon points="360 145 400 135 400 170 360 155" fill="url(#beamGrad)" opacity="0.6" />
                  <defs>
                    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#43D500" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#12CFEA" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Floating Live Telemetry Cards */}
              <div className="eway-visual__float-card eway-visual__float-card--top">
                <div className="eway-visual__float-icon eway-visual__float-icon--lime">⚡</div>
                <div>
                  <div className="eway-visual__float-label">Benz Circle Superhub</div>
                  <div className="eway-visual__float-val">120kW Dual CCS2 · Available</div>
                </div>
              </div>

              <div className="eway-visual__float-card eway-visual__float-card--bottom">
                <div className="eway-visual__float-icon eway-visual__float-icon--cyan">💳</div>
                <div>
                  <div className="eway-visual__float-label">Eway Smart Wallet</div>
                  <div className="eway-visual__float-val">Instant 0% Fee Credit · GST Invoices</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OPERATIONS COMMAND CENTER BANNER STRIP */}
      <section className="eway-ops-strip" aria-label="Live Operations Status">
        <div className="eway-ops-strip__container">
          <div className="eway-ops-strip__live-badge">
            <span className="eway-ops-strip__pulse-dot" />
            <span>ENTERPRISE GRID COMMAND</span>
          </div>

          <div className="eway-ops-strip__metrics">
            <div className="eway-ops-strip__item">
              <span className="eway-ops-strip__label">Live Available Chargers:</span>
              <span className="eway-ops-strip__val eway-ops-strip__val--green">
                {isLoading ? '...' : `${summary.availableChargers} Units Ready`}
              </span>
            </div>

            <div className="eway-ops-strip__item">
              <span className="eway-ops-strip__label">Active Charging Sessions:</span>
              <span className="eway-ops-strip__val eway-ops-strip__val--cyan">
                {isLoading ? '...' : `${summary.activeSessions} Active`}
              </span>
            </div>

            <div className="eway-ops-strip__item">
              <span className="eway-ops-strip__label">Today Network Revenue:</span>
              <span className="eway-ops-strip__val">
                {isLoading ? '...' : formatCurrencyINR(summary.todayRevenueINR).replace('.00', '')}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="eway-ops-strip__btn"
            onClick={handleAdminQuickLogin}
          >
            <span>Access Operations Console</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

      {/* 4. THREE PILLARS (FEATURES SHOWCASE) */}
      <section className="eway-features-section" id="network">
        <div className="container">
          <div className="eway-section-header">
            <span className="eway-section-badge">NEXT-GENERATION PLATFORM</span>
            <h2 className="eway-section-title">Built for Modern Electric Mobility</h2>
            <p className="eway-section-desc">
              High-speed hardware meets intelligent software. Experience lightning-quick charging without friction, queues, or hidden fees.
            </p>
          </div>

          <div className="eway-features-grid">
            {/* Feature 1 */}
            <div className="eway-feature-card">
              <div className="eway-feature-card__icon-box eway-feature-card__icon-box--green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="eway-feature-card__title">High-Speed DC Superchargers</h3>
              <p className="eway-feature-card__desc">
                Deploying 60kW to 150kW Dual-Gun DC fast chargers equipped with CCS2, Type 2, and GB/T connectors. Power your EV from 20% to 80% in under 30 minutes.
              </p>
              <ul className="eway-feature-card__list">
                <li>✓ Dynamic power balancing</li>
                <li>✓ Real-time gun availability telemetry</li>
                <li>✓ 99.8% guaranteed power uptime</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="eway-feature-card eway-feature-card--featured" id="wallet">
              <div className="eway-feature-card__badge">MOST POPULAR</div>
              <div className="eway-feature-card__icon-box eway-feature-card__icon-box--cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h3 className="eway-feature-card__title">Zero-Friction Smart Wallet</h3>
              <p className="eway-feature-card__desc">
                Prepaid wallet with instant UPI, Credit/Debit Card, and Net Banking top-ups. Zero convenience fees, auto-settlement, and instant GST invoices.
              </p>
              <ul className="eway-feature-card__list">
                <li>✓ Zero convenience fees on all recharges</li>
                <li>✓ One-tap instant RFID/QR session start</li>
                <li>✓ GST-compliant tax invoices (SAC 998714)</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="eway-feature-card">
              <div className="eway-feature-card__icon-box eway-feature-card__icon-box--navy">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3 className="eway-feature-card__title">Eway AI Range & Route Copilot</h3>
              <p className="eway-feature-card__desc">
                Intelligent range prediction and off-peak charging schedules based on actual vehicle battery chemistry and Andhra Pradesh highway routes.
              </p>
              <ul className="eway-feature-card__list">
                <li>✓ 80% SoC battery health recommendation</li>
                <li>✓ Off-peak tariff optimization saving up to 15%</li>
                <li>✓ Real-time station navigation & slot reservations</li>
              </ul>
            </div>
          </div>

          {/* Featured Live Stations on the Eway Grid */}
          <div className="eway-home-stations">
            <div className="eway-home-stations__header">
              <div>
                <span className="eway-home-stations__badge">LIVE NETWORK STATUS</span>
                <h3 className="eway-home-stations__title">Featured High-Speed Hubs</h3>
              </div>
              <button
                type="button"
                className="eway-home-stations__view-all-btn"
                onClick={handleCustomerLogin}
              >
                <span>View All 80+ Chargers</span>
                <span>→</span>
              </button>
            </div>

            <div className="eway-home-stations__grid">
              {stations.slice(0, 3).map((st) => (
                <div key={st.id} className="eway-home-station-card">
                  <div className="eway-home-station-card__header">
                    <span className="eway-home-station-card__city">{st.city}</span>
                    <span className={`eway-home-station-card__status ${st.availableChargers > 0 ? 'eway-home-station-card__status--avail' : ''}`}>
                      ● {st.availableChargers > 0 ? `${st.availableChargers} Available` : 'Queue Active'}
                    </span>
                  </div>
                  <h4 className="eway-home-station-card__name">{st.name}</h4>
                  <p className="eway-home-station-card__address">{st.address}</p>
                  
                  <div className="eway-home-station-card__specs">
                    <div className="eway-home-station-card__spec">
                      <span className="eway-home-station-card__spec-label">Speed</span>
                      <span className="eway-home-station-card__spec-val">{st.powerKw} kW DC</span>
                    </div>
                    <div className="eway-home-station-card__spec">
                      <span className="eway-home-station-card__spec-label">Connector</span>
                      <span className="eway-home-station-card__spec-val">{st.connectorType}</span>
                    </div>
                    <div className="eway-home-station-card__spec">
                      <span className="eway-home-station-card__spec-label">Tariff</span>
                      <span className="eway-home-station-card__spec-val">₹{st.ratePerKWh}/kWh</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="eway-home-station-card__btn"
                    onClick={handleCustomerLogin}
                  >
                    Reserve or Start Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE TARIFF & COST CALCULATOR */}
      <section className="eway-calculator-section" id="calculator">
        <div className="container">
          <div className="eway-calc-card">
            <div className="eway-calc-card__left">
              <span className="eway-section-badge">TRANSPARENT PRICING</span>
              <h2 className="eway-calc-card__title">EV Charging Cost Estimator</h2>
              <p className="eway-calc-card__desc">
                Calculate estimated energy units, charging duration on a 60kW DC charger, and complete GST breakdown. No hidden fees or surprise charges.
              </p>

              <div className="eway-calc-card__slider-box">
                <div className="eway-calc-card__slider-header">
                  <span className="eway-calc-card__slider-label">Energy Units to Add:</span>
                  <span className="eway-calc-card__slider-val">{calculatorKWh} kWh</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={calculatorKWh}
                  onChange={(e) => setCalculatorKWh(parseInt(e.target.value, 10))}
                  className="eway-calc-card__range"
                  aria-label="Select energy units in kWh"
                />
                <div className="eway-calc-card__presets">
                  {[15, 25, 40, 60].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`eway-calc-card__preset-btn ${calculatorKWh === val ? 'eway-calc-card__preset-btn--active' : ''}`}
                      onClick={() => setCalculatorKWh(val)}
                    >
                      {val} kWh
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="eway-calc-card__right">
              <div className="eway-calc-receipt">
                <div className="eway-calc-receipt__header">
                  <span className="eway-calc-receipt__title">Cost Breakdown</span>
                  <span className="eway-calc-receipt__rate">@ ₹{baseRatePerKWh}/kWh</span>
                </div>

                <div className="eway-calc-receipt__rows">
                  <div className="eway-calc-receipt__row">
                    <span>Base Energy Charges ({calculatorKWh} kWh)</span>
                    <span>₹{energyCost.toFixed(2)}</span>
                  </div>
                  <div className="eway-calc-receipt__row">
                    <span>GST (18% SGST + CGST)</span>
                    <span>₹{gstCost.toFixed(2)}</span>
                  </div>
                  <div className="eway-calc-receipt__row">
                    <span>Convenience Fee</span>
                    <span className="eway-calc-receipt__free">₹0.00 (FREE)</span>
                  </div>
                </div>

                <div className="eway-calc-receipt__divider" />

                <div className="eway-calc-receipt__total-row">
                  <div>
                    <span className="eway-calc-receipt__total-label">Total Estimated Cost</span>
                    <span className="eway-calc-receipt__time-hint">~{estChargingTimeMin} mins on 60kW DC Fast</span>
                  </div>
                  <span className="eway-calc-receipt__total-val">₹{totalCost.toFixed(2)}</span>
                </div>

                <button
                  type="button"
                  className="eway-calc-receipt__cta-btn"
                  onClick={handleCustomerLogin}
                >
                  Recharge Eway Wallet Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="eway-how-section">
        <div className="container">
          <div className="eway-section-header">
            <span className="eway-section-badge">SEAMLESS USER EXPERIENCE</span>
            <h2 className="eway-section-title">How Eway to Your EVs Works</h2>
            <p className="eway-section-desc">
              Four simple steps from locating a charger to driving away with a full battery and an automated GST invoice.
            </p>
          </div>

          <div className="eway-how-grid">
            <div className="eway-how-step">
              <div className="eway-how-step__num">01</div>
              <h3 className="eway-how-step__title">Locate Station</h3>
              <p className="eway-how-step__desc">
                Find available charging stations along your route with real-time gun occupancy, power kW, and pricing.
              </p>
            </div>

            <div className="eway-how-step">
              <div className="eway-how-step__num">02</div>
              <h3 className="eway-how-step__title">Scan & Plug In</h3>
              <p className="eway-how-step__desc">
                Connect the heavy-duty CCS2 connector to your EV and scan the QR code using the Eway customer app.
              </p>
            </div>

            <div className="eway-how-step">
              <div className="eway-how-step__num">03</div>
              <h3 className="eway-how-step__title">Live Monitoring</h3>
              <p className="eway-how-step__desc">
                Watch energy flow, real-time kW speeds, battery percentage, and live costs right from your dashboard.
              </p>
            </div>

            <div className="eway-how-step">
              <div className="eway-how-step__num">04</div>
              <h3 className="eway-how-step__title">Instant Auto-Settle</h3>
              <p className="eway-how-step__desc">
                Session automatically stops when target SoC is reached. Instant wallet deduction and digital GST receipt sent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="eway-faqs-section" id="faqs">
        <div className="container">
          <div className="eway-section-header">
            <span className="eway-section-badge">HELP & SUPPORT</span>
            <h2 className="eway-section-title">Frequently Asked Questions</h2>
            <p className="eway-section-desc">
              Have questions about our charging network, wallet billing, or enterprise operations? We have answers.
            </p>
          </div>

          <div className="eway-faqs-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`eway-faq-item ${activeFaq === index ? 'eway-faq-item--active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="eway-faq-item__question">
                  <span>{faq.q}</span>
                  <span className="eway-faq-item__toggle-icon">
                    {activeFaq === index ? '−' : '+'}
                  </span>
                </div>
                {activeFaq === index && (
                  <div className="eway-faq-item__answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONVERSION CTA BANNER */}
      <section className="eway-cta-section">
        <div className="container">
          <div className="eway-cta-banner">
            <div className="eway-cta-banner__content">
              <h2 className="eway-cta-banner__title">Ready to Electrify Your Journey?</h2>
              <p className="eway-cta-banner__desc">
                Join thousands of drivers powering their electric vehicles with Andhra Pradesh's most trusted, ultra-fast charging platform.
              </p>
              <div className="eway-cta-banner__actions">
                <button
                  type="button"
                  className="eway-cta-banner__btn-primary"
                  onClick={handleCustomerLogin}
                >
                  Create Customer Account
                </button>
                <button
                  type="button"
                  className="eway-cta-banner__btn-secondary"
                  onClick={handleAdminQuickLogin}
                >
                  Admin Operations Console
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. GLOBAL FOOTER */}
      <footer className="eway-footer" role="contentinfo">
        <div className="container eway-footer__container">
          <div className="eway-footer__top">
            <div className="eway-footer__brand-col">
              <div className="eway-footer__brand">
                <div className="eway-footer__logo-wrap">
                  <img src="/eway-logo.png" alt="Eway to Your EVs" />
                </div>
                <span className="eway-footer__brand-title">Eway to Your EVs</span>
              </div>
              <p className="eway-footer__tagline">
                Next-generation electric vehicle charging infrastructure, smart prepaid wallets, and telemetry across Andhra Pradesh.
              </p>
              <div className="eway-footer__security-badge">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>256-Bit SSL Encrypted · PCI-DSS Compliant</span>
              </div>
            </div>

            <div className="eway-footer__links-col">
              <h4 className="eway-footer__heading">Platform</h4>
              <ul className="eway-footer__links">
                <li><a href="#overview">Network Overview</a></li>
                <li><a href="#network">Find Chargers</a></li>
                <li><a href="#wallet">Eway Smart Wallet</a></li>
                <li><a href="#calculator">Tariff Estimator</a></li>
              </ul>
            </div>

            <div className="eway-footer__links-col">
              <h4 className="eway-footer__heading">Enterprise</h4>
              <ul className="eway-footer__links">
                <li><button type="button" onClick={handleAdminQuickLogin} className="eway-footer__btn-link">Operations Center</button></li>
                <li><button type="button" onClick={handleAdminQuickLogin} className="eway-footer__btn-link">Grid Telemetry</button></li>
                <li><button type="button" onClick={handleAdminQuickLogin} className="eway-footer__btn-link">Maintenance Logs</button></li>
                <li><button type="button" onClick={handleAdminQuickLogin} className="eway-footer__btn-link">Fleet Pricing</button></li>
              </ul>
            </div>

            <div className="eway-footer__links-col">
              <h4 className="eway-footer__heading">Support</h4>
              <ul className="eway-footer__links">
                <li><span className="eway-footer__text-link">24x7 Roadside: 1800-EWAY-EV</span></li>
                <li><span className="eway-footer__text-link">support@ewaytoyourevs.in</span></li>
                <li><a href="#faqs">Frequently Asked Questions</a></li>
                <li><span className="eway-footer__text-link">Vijayawada, Andhra Pradesh</span></li>
              </ul>
            </div>
          </div>

          <div className="eway-footer__bottom">
            <p className="eway-footer__copyright">
              © {new Date().getFullYear()} Eway to Your EVs Private Limited. All rights reserved.
            </p>
            <div className="eway-footer__legal-links">
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Terms of Service</span>
              <span>·</span>
              <span>GST Compliance</span>
              <span>·</span>
              <button
                type="button"
                onClick={() => navigate('/super-admin/login')}
                className="eway-footer__superadmin-link"
                title="Super Admin Audit & Executive Portal"
              >
                Executive Portal
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Home;
