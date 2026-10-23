import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { authoritativeWalletService } from '../../../services/walletService';
import { paymentGatewayService } from '../../../services/paymentGatewayService';
import { AuthoritativeLedgerRecord, SavedPaymentMethod } from '../../../types/payment';
import { CustomerProfile } from '../../../types/customer';
import { customerService } from '../../../services/customerService';
import { PaymentModal } from '../../../components/payment/PaymentModal/PaymentModal';
import { AddPaymentMethodModal } from '../../../components/payment/AddPaymentMethodModal/AddPaymentMethodModal';
import { ConfirmRemoveModal } from '../../../components/payment/ConfirmRemoveModal/ConfirmRemoveModal';
import { TransactionDetailsModal } from '../../../components/payment/TransactionDetailsModal/TransactionDetailsModal';
import './Wallet.css';

type FilterType = 'all' | 'recharge' | 'charging' | 'refund';
type SortType = 'newest' | 'oldest' | 'amount_high' | 'amount_low';

export const Wallet: React.FC = () => {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [balance, setBalance] = useState<number>(1250);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search & Pagination State
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortType>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Saved payment methods
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>([]);

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState<boolean>(false);
  const [methodToRemove, setMethodToRemove] = useState<SavedPaymentMethod | null>(null);
  const [selectedTxForDetails, setSelectedTxForDetails] = useState<AuthoritativeLedgerRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  // Refs for smooth navigation shortcuts
  const savedMethodsRef = useRef<HTMLDivElement>(null);
  const transactionsRef = useRef<HTMLDivElement>(null);

  // Toast / Global Notification
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  // Load wallet & profile data
  const loadWalletData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const prof = await customerService.getProfile();
      setProfile(prof);
      setBalance(authoritativeWalletService.getBalance());
      setSavedMethods(paymentGatewayService.getSavedMethods());
    } catch {
      setError('Unable to load wallet information. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWalletData();

    // Subscribe to real-time wallet ledger updates
    const unsubscribe = authoritativeWalletService.subscribe((newBal) => {
      setBalance(newBal);
      setProfile((prev) => (prev ? { ...prev, walletBalance: newBal } : prev));
    });

    return () => {
      unsubscribe();
    };
  }, [loadWalletData]);

  // Query paginated and filtered ledger
  const queryResult = useMemo(() => {
    return authoritativeWalletService.queryLedger({
      filter: activeFilter,
      search: searchQuery,
      page: currentPage,
      pageSize,
      sort: sortOrder,
    });
  }, [activeFilter, searchQuery, currentPage, sortOrder, balance]);

  const { records: currentTransactions, total, totalPages, summary: summaries } = queryResult;

  // Handle Export CSV Statement
  const handleExportStatement = () => {
    const csvContent = authoritativeWalletService.generateCsvStatement();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `eway_wallet_statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Official Eway Wallet Statement downloaded successfully!', 'success');
  };

  // Set default payment method
  const handleSetDefaultMethod = (id: string) => {
    const ok = paymentGatewayService.setDefaultMethod(id);
    if (ok) {
      setSavedMethods(paymentGatewayService.getSavedMethods());
      showToast('Default payment method updated successfully.', 'success');
    }
  };

  // Request remove payment method (opens confirmation modal)
  const handleRequestRemoveMethod = (method: SavedPaymentMethod) => {
    setMethodToRemove(method);
  };

  // Confirm remove payment method
  const handleConfirmRemoveMethod = () => {
    if (!methodToRemove) return;
    const ok = paymentGatewayService.deleteSavedMethod(methodToRemove.id);
    if (ok) {
      setSavedMethods(paymentGatewayService.getSavedMethods());
      showToast(`Removed ${methodToRemove.title} from saved methods.`, 'success');
    }
    setMethodToRemove(null);
  };

  // Add new payment method success callback
  const handleAddMethodSuccess = (newMethod: SavedPaymentMethod) => {
    setSavedMethods(paymentGatewayService.getSavedMethods());
    showToast(`✓ Added ${newMethod.title} to your saved payment methods!`, 'success');
  };

  // Open details modal
  const handleViewTransactionDetails = (tx: AuthoritativeLedgerRecord) => {
    setSelectedTxForDetails(tx);
    setIsDetailsModalOpen(true);
  };

  // Helper currency formatting
  const formatINR = (val: number, showDecimals: boolean = true) => {
    return `₹${val.toLocaleString('en-IN', {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const getTransactionVisual = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t === 'recharge' || t === 'credit') {
      return {
        label: 'Recharge',
        icon: '↙',
        iconClass: 'eway-wallet__type-icon--recharge',
        textClass: 'eway-wallet__type-text--recharge',
        amountPrefix: '+',
        amountClass: 'eway-wallet__amount--positive',
      };
    }
    if (t === 'refund') {
      return {
        label: 'Refund',
        icon: '↻',
        iconClass: 'eway-wallet__type-icon--refund',
        textClass: 'eway-wallet__type-text--refund',
        amountPrefix: '+',
        amountClass: 'eway-wallet__amount--positive',
      };
    }
    return {
      label: 'Charging',
      icon: '↗',
      iconClass: 'eway-wallet__type-icon--charging',
      textClass: 'eway-wallet__type-text--charging',
      amountPrefix: '-',
      amountClass: 'eway-wallet__amount--negative',
    };
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <CustomerLayout>
      <div className="eway-wallet-page">
        {/* Toast Notification */}
        {toastMessage && (
          <div className={`eway-wallet__toast eway-wallet__toast--${toastMessage.type}`} role="alert">
            <span className="eway-wallet__toast-icon">✓</span>
            <span className="eway-wallet__toast-text">{toastMessage.text}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="eway-wallet__loading-skeleton">
            <div className="eway-wallet__skeleton-hero" />
            <div className="eway-wallet__skeleton-summary-grid">
              <div className="eway-wallet__skeleton-card" />
              <div className="eway-wallet__skeleton-card" />
              <div className="eway-wallet__skeleton-card" />
              <div className="eway-wallet__skeleton-card" />
            </div>
            <div className="eway-wallet__skeleton-table" />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="eway-wallet__error-state">
            <div className="eway-wallet__error-icon">⚠️</div>
            <h2 className="eway-wallet__error-title">Unable to Load Wallet</h2>
            <p className="eway-wallet__error-desc">{error}</p>
            <button type="button" className="eway-wallet__retry-btn" onClick={loadWalletData}>
              Try Again
            </button>
          </div>
        )}

        {/* Loaded Content */}
        {!isLoading && !error && (
          <>
            {/* ============================================================== */}
            {/* 1. WALLET HERO & OVERVIEW */}
            {/* ============================================================== */}
            <div className="eway-wallet__hero">
              <div className="eway-wallet__hero-content">
                <div className="eway-wallet__hero-badge-row">
                  <div className="eway-wallet__hero-logo-wrap">
                    <img src="/eway-logo.png" alt="Eway to Your EVs" />
                  </div>
                  <span className="eway-wallet__hero-badge">
                    EWAY SMART WALLET · {profile?.name ? profile.name.toUpperCase() : 'VERIFIED ACCOUNT'}
                  </span>
                  <span className="eway-wallet__active-pill">● ACTIVE & SECURED</span>
                </div>

                <div className="eway-wallet__balance-group">
                  <span className="eway-wallet__balance-currency">₹</span>
                  <h1 className="eway-wallet__balance">
                    {balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h1>
                </div>

                <p className="eway-wallet__balance-label">
                  Available balance for ultra-fast EV charging across Andhra Pradesh & Telangana
                </p>

                {/* Primary Actions */}
                <div className="eway-wallet__hero-actions">
                  <button
                    type="button"
                    className="eway-wallet__add-money-btn"
                    onClick={() => setIsPaymentModalOpen(true)}
                    aria-label="Add Money to Eway Wallet"
                    id="wallet-add-money-trigger"
                  >
                    <span className="eway-wallet__btn-icon">⚡</span>
                    <span>Add Money</span>
                  </button>

                  <button
                    type="button"
                    className="eway-wallet__add-card-btn"
                    onClick={() => setIsAddMethodModalOpen(true)}
                    id="wallet-add-payment-method-trigger"
                  >
                    <span className="eway-wallet__btn-icon">💳</span>
                    <span>Add Payment Method</span>
                  </button>

                  <button
                    type="button"
                    className="eway-wallet__statement-btn"
                    onClick={handleExportStatement}
                    title="Download official statement in CSV format"
                  >
                    <span>📥 Statement</span>
                  </button>
                </div>

                {/* Shortcuts Row */}
                <div className="eway-wallet__shortcuts">
                  <span className="eway-wallet__shortcuts-label">Quick Jump:</span>
                  <button
                    type="button"
                    className="eway-wallet__shortcut-link"
                    onClick={() => scrollToSection(savedMethodsRef)}
                  >
                    Saved Methods ({savedMethods.length}) ↓
                  </button>
                  <button
                    type="button"
                    className="eway-wallet__shortcut-link"
                    onClick={() => scrollToSection(transactionsRef)}
                  >
                    Recent Activity ({total}) ↓
                  </button>
                </div>
              </div>

              {/* Decorative Brand Accent Graphic */}
              <div className="eway-wallet__hero-graphic" aria-hidden="true">
                <div className="eway-wallet__graphic-glow" />
                <div className="eway-wallet__graphic-ring eway-wallet__graphic-ring--outer" />
                <div className="eway-wallet__graphic-ring eway-wallet__graphic-ring--inner" />
              </div>
            </div>

            {/* ============================================================== */}
            {/* 2. SUMMARY METRICS (4 CARDS) */}
            {/* ============================================================== */}
            <div className="eway-wallet__summary-grid">
              {/* Card 1: Total Recharged */}
              <div className="eway-wallet__summary-card">
                <div className="eway-wallet__summary-icon eway-wallet__summary-icon--green">
                  ↙
                </div>
                <div className="eway-wallet__summary-meta">
                  <div className="eway-wallet__summary-val">
                    {formatINR(summaries.totalRecharged, false)}
                  </div>
                  <div className="eway-wallet__summary-label">Total Recharged</div>
                </div>
              </div>

              {/* Card 2: Charging Spend */}
              <div className="eway-wallet__summary-card">
                <div className="eway-wallet__summary-icon eway-wallet__summary-icon--navy">
                  ↗
                </div>
                <div className="eway-wallet__summary-meta">
                  <div className="eway-wallet__summary-val">
                    {formatINR(summaries.chargingSpend, false)}
                  </div>
                  <div className="eway-wallet__summary-label">Charging Spend</div>
                </div>
              </div>

              {/* Card 3: Refunds */}
              <div className="eway-wallet__summary-card">
                <div className="eway-wallet__summary-icon eway-wallet__summary-icon--emerald">
                  ↻
                </div>
                <div className="eway-wallet__summary-meta">
                  <div className="eway-wallet__summary-val">
                    {formatINR(summaries.refunds, false)}
                  </div>
                  <div className="eway-wallet__summary-label">Refunds Credited</div>
                </div>
              </div>

              {/* Card 4: Sessions Count */}
              <div className="eway-wallet__summary-card">
                <div className="eway-wallet__summary-icon eway-wallet__summary-icon--lime">
                  ⚡
                </div>
                <div className="eway-wallet__summary-meta">
                  <div className="eway-wallet__summary-val">
                    {summaries.sessionsCount} Sessions
                  </div>
                  <div className="eway-wallet__summary-label">Sessions Settled</div>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 3. SAVED PAYMENT METHODS SECTION (MANDATORY REDESIGN) */}
            {/* ============================================================== */}
            <div className="eway-wallet__saved-container" ref={savedMethodsRef}>
              <div className="eway-wallet__saved-header">
                <div>
                  <h2 className="eway-wallet__section-title">Saved Payment Methods</h2>
                  <p className="eway-wallet__section-sub">
                    Secure 1-click methods for fast EV charging and automatic wallet top-ups
                  </p>
                </div>
                <button
                  type="button"
                  className="eway-wallet__add-method-btn"
                  onClick={() => setIsAddMethodModalOpen(true)}
                  id="wallet-add-method-section-btn"
                >
                  <span>+ Add Payment Method</span>
                </button>
              </div>

              {/* Empty State */}
              {savedMethods.length === 0 ? (
                <div className="eway-wallet__saved-empty">
                  <div className="eway-wallet__empty-icon">💳</div>
                  <h3 className="eway-wallet__empty-title">No Saved Payment Methods</h3>
                  <p className="eway-wallet__empty-desc">
                    Save a credit card, debit card, or UPI handle for frictionless 1-click charging
                    sessions.
                  </p>
                  <button
                    type="button"
                    className="eway-wallet__add-method-btn"
                    onClick={() => setIsAddMethodModalOpen(true)}
                  >
                    + Add Your First Payment Method
                  </button>
                </div>
              ) : (
                /* Dynamic Cards Grid */
                <div className="eway-wallet__saved-cards-grid">
                  {savedMethods.map((m) => {
                    const isDefault = !!m.isDefault;
                    return (
                      <div
                        key={m.id}
                        className={`eway-wallet__method-card ${isDefault ? 'eway-wallet__method-card--default' : ''}`}
                      >
                        <div className="eway-wallet__card-top">
                          <div className="eway-wallet__card-brand-box">
                            <span className="eway-wallet__card-type-icon">
                              {m.type === 'card' ? '💳' : '📱'}
                            </span>
                            <span className="eway-wallet__card-brand-name">
                              {m.brand ? m.brand.toUpperCase() : m.type.toUpperCase()}
                            </span>
                          </div>
                          {isDefault && (
                            <span className="eway-wallet__badge-default">DEFAULT METHOD</span>
                          )}
                        </div>

                        <div className="eway-wallet__card-mid">
                          <h4 className="eway-wallet__card-title">{m.title}</h4>
                          <span className="eway-wallet__card-sub">{m.subtitle}</span>
                        </div>

                        <div className="eway-wallet__card-actions">
                          {!isDefault ? (
                            <button
                              type="button"
                              className="eway-wallet__card-btn-default"
                              onClick={() => handleSetDefaultMethod(m.id)}
                              title="Make this your default payment method"
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span className="eway-wallet__card-primary-indicator">
                              ✓ Primary Charging Card
                            </span>
                          )}

                          <button
                            type="button"
                            className="eway-wallet__card-btn-delete"
                            onClick={() => handleRequestRemoveMethod(m)}
                            title="Remove payment method"
                            aria-label={`Remove ${m.title}`}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add New Card Dashed Box */}
                  <button
                    type="button"
                    className="eway-wallet__add-card-placeholder"
                    onClick={() => setIsAddMethodModalOpen(true)}
                  >
                    <span className="eway-wallet__add-card-plus">+</span>
                    <span className="eway-wallet__add-card-label">Add New Card or UPI</span>
                    <span className="eway-wallet__add-card-hint">Instant verification</span>
                  </button>
                </div>
              )}
            </div>

            {/* ============================================================== */}
            {/* 4. TRANSACTION HISTORY SECTION */}
            {/* ============================================================== */}
            <div className="eway-wallet__tx-container" ref={transactionsRef}>
              <div className="eway-wallet__tx-header">
                <div>
                  <h2 className="eway-wallet__section-title">Authoritative Transaction Ledger</h2>
                  <p className="eway-wallet__section-sub">
                    Showing {total} verified transactions · Click any row for Tax Invoice & breakdown
                  </p>
                </div>

                {/* Search Bar & Sort Dropdown */}
                <div className="eway-wallet__controls-row">
                  <div className="eway-wallet__search-wrap">
                    <span className="eway-wallet__search-icon">🔍</span>
                    <input
                      type="text"
                      className="eway-wallet__search-input"
                      placeholder="Search ID, station, amount..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="eway-wallet__search-clear"
                        onClick={() => setSearchQuery('')}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <select
                    className="eway-wallet__sort-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortType)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount_high">Highest Amount</option>
                    <option value="amount_low">Lowest Amount</option>
                  </select>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="eway-wallet__filters-bar">
                <div className="eway-wallet__filters" role="tablist" aria-label="Transaction Filters">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === 'all'}
                    className={`eway-wallet__filter-tab ${activeFilter === 'all' ? 'eway-wallet__filter-tab--active' : ''}`}
                    onClick={() => {
                      setActiveFilter('all');
                      setCurrentPage(1);
                    }}
                  >
                    All Transactions
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === 'recharge'}
                    className={`eway-wallet__filter-tab ${activeFilter === 'recharge' ? 'eway-wallet__filter-tab--active' : ''}`}
                    onClick={() => {
                      setActiveFilter('recharge');
                      setCurrentPage(1);
                    }}
                  >
                    Top-ups & Credits
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === 'charging'}
                    className={`eway-wallet__filter-tab ${activeFilter === 'charging' ? 'eway-wallet__filter-tab--active' : ''}`}
                    onClick={() => {
                      setActiveFilter('charging');
                      setCurrentPage(1);
                    }}
                  >
                    Charging Debits
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === 'refund'}
                    className={`eway-wallet__filter-tab ${activeFilter === 'refund' ? 'eway-wallet__filter-tab--active' : ''}`}
                    onClick={() => {
                      setActiveFilter('refund');
                      setCurrentPage(1);
                    }}
                  >
                    Refunds
                  </button>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="eway-wallet__table-wrapper">
                <table className="eway-wallet__table">
                  <thead>
                    <tr>
                      <th className="eway-wallet__th">DATE & TIME</th>
                      <th className="eway-wallet__th">REF / ID</th>
                      <th className="eway-wallet__th">TYPE & METHOD</th>
                      <th className="eway-wallet__th">DESCRIPTION</th>
                      <th className="eway-wallet__th">AMOUNT</th>
                      <th className="eway-wallet__th">STATUS</th>
                      <th className="eway-wallet__th">BALANCE AFTER</th>
                      <th className="eway-wallet__th">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="eway-wallet__empty-cell">
                          <div className="eway-wallet__empty-state">
                            <p className="eway-wallet__empty-title">No matching transactions</p>
                            <p className="eway-wallet__empty-desc">
                              {searchQuery ? `No records found for "${searchQuery}".` : 'Your wallet activity will appear here.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentTransactions.map((tx) => {
                        const visual = getTransactionVisual(tx.type);
                        return (
                          <tr
                            key={tx.id}
                            className="eway-wallet__row"
                            onClick={() => handleViewTransactionDetails(tx)}
                            title="Click to view details and receipt"
                          >
                            <td className="eway-wallet__td eway-wallet__td--date">
                              {tx.date}
                            </td>
                            <td className="eway-wallet__td eway-wallet__td--id">
                              <span className="eway-wallet__ref-code">{tx.id}</span>
                            </td>
                            <td className="eway-wallet__td eway-wallet__td--type">
                              <span className={`eway-wallet__type-badge ${visual.textClass}`}>
                                <span className="eway-wallet__type-arrow">{visual.icon}</span>
                                <span>{visual.label}</span>
                              </span>
                              <span className="eway-wallet__method-sub">{tx.paymentMethod}</span>
                            </td>
                            <td className="eway-wallet__td eway-wallet__td--desc">
                              <span className="eway-wallet__desc-main">{tx.title}</span>
                              <span className="eway-wallet__desc-sub">{tx.description}</span>
                            </td>
                            <td className={`eway-wallet__td eway-wallet__td--amount ${visual.amountClass}`}>
                              {visual.amountPrefix}₹{Number(tx.amountINR).toFixed(2)}
                            </td>
                            <td className="eway-wallet__td eway-wallet__td--status">
                              <span className="eway-wallet__status-pill eway-wallet__status-pill--success">
                                ✓ {tx.status || 'Success'}
                              </span>
                            </td>
                            <td className="eway-wallet__td eway-wallet__td--balance">
                              ₹{Number(tx.balanceAfterINR ?? 0).toFixed(2)}
                            </td>
                            <td className="eway-wallet__td eway-wallet__td--action">
                              <button
                                type="button"
                                className="eway-wallet__view-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewTransactionDetails(tx);
                                }}
                              >
                                View ↗
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="eway-wallet__mobile-list">
                {currentTransactions.length === 0 ? (
                  <div className="eway-wallet__empty-state">
                    <p className="eway-wallet__empty-title">No transactions found</p>
                    <p className="eway-wallet__empty-desc">Try clearing filters or search terms.</p>
                  </div>
                ) : (
                  currentTransactions.map((tx) => {
                    const visual = getTransactionVisual(tx.type);
                    return (
                      <div
                        key={tx.id}
                        className="eway-wallet__mobile-card"
                        onClick={() => handleViewTransactionDetails(tx)}
                      >
                        <div className="eway-wallet__mobile-card-top">
                          <div className="eway-wallet__mobile-card-type">
                            <span className={`eway-wallet__type-badge ${visual.textClass}`}>
                              <span className="eway-wallet__type-arrow">{visual.icon}</span>
                              <span>{visual.label}</span>
                            </span>
                            <span className="eway-wallet__mobile-tx-id">{tx.id}</span>
                          </div>
                          <span className={`eway-wallet__mobile-amount ${visual.amountClass}`}>
                            {visual.amountPrefix}₹{Number(tx.amountINR).toFixed(2)}
                          </span>
                        </div>

                        <div className="eway-wallet__mobile-card-mid">
                          <span className="eway-wallet__mobile-title">{tx.title}</span>
                          <span className="eway-wallet__mobile-desc">{tx.description}</span>
                        </div>

                        <div className="eway-wallet__mobile-card-bottom">
                          <span className="eway-wallet__mobile-date">{tx.date}</span>
                          <div className="eway-wallet__mobile-meta">
                            <span className="eway-wallet__status-pill eway-wallet__status-pill--success">
                              ✓ {tx.status || 'Success'}
                            </span>
                            <span className="eway-wallet__mobile-balance">
                              Bal: ₹{Number(tx.balanceAfterINR ?? 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="eway-wallet__pagination">
                  <span className="eway-wallet__pagination-info">
                    Page {currentPage} of {totalPages} ({total} items)
                  </span>

                  <div className="eway-wallet__pagination-btns">
                    <button
                      type="button"
                      className="eway-wallet__page-btn"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      ← Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`eway-wallet__page-num ${num === currentPage ? 'eway-wallet__page-num--active' : ''}`}
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="eway-wallet__page-btn"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Modal: Add Money to Wallet */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          mode="wallet_topup"
          defaultAmount={500}
          orderTitle="Add Money to Eway Wallet"
          orderDescription="Instant recharge for EV charging stations across AP & Telangana"
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={() => {
            showToast('✓ Wallet balance credited successfully!', 'success');
          }}
        />

        {/* Modal: Add New Payment Method */}
        <AddPaymentMethodModal
          isOpen={isAddMethodModalOpen}
          onClose={() => setIsAddMethodModalOpen(false)}
          onSuccess={handleAddMethodSuccess}
        />

        {/* Modal: Confirm Remove Payment Method */}
        <ConfirmRemoveModal
          isOpen={!!methodToRemove}
          method={methodToRemove}
          canRemoveDefault={savedMethods.length > 1}
          onClose={() => setMethodToRemove(null)}
          onConfirm={handleConfirmRemoveMethod}
        />

        {/* Modal: Transaction Details & Printable Tax Invoice */}
        <TransactionDetailsModal
          transaction={selectedTxForDetails}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTxForDetails(null);
          }}
        />
      </div>
    </CustomerLayout>
  );
};

export default Wallet;
