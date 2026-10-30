import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../../context/SuperAdminContext';

export const SummaryCards: React.FC = () => {
  const navigate = useNavigate();
  const { metrics, isLoading } = useSuperAdmin();

  if (isLoading || !metrics) {
    return (
      <div className="sa-metrics-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="sa-metric-card"
            style={{ height: '140px', opacity: 0.5, animation: 'pulse 1.5s infinite' }}
          >
            <div style={{ height: 20, width: '60%', background: 'var(--sa-border)', borderRadius: 4 }} />
            <div style={{ height: 36, width: '80%', background: 'var(--sa-border)', borderRadius: 6, margin: '12px 0' }} />
            <div style={{ height: 16, width: '40%', background: 'var(--sa-border)', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    );
  }

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      id: 'areas',
      label: 'Total Regional Areas',
      value: metrics.totalAreas,
      iconClass: 'sa-icon-cyan',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
      subtext: 'Andhra Pradesh Grid Hubs',
      route: '/super-admin/areas',
    },
    {
      id: 'admins',
      label: 'Total Assigned Admins',
      value: metrics.totalAdmins,
      iconClass: 'sa-icon-lime',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      subtext: `${metrics.activeAdmins} active on-duty`,
      route: '/super-admin/admins',
    },
    {
      id: 'active_admins',
      label: 'Active Area Admins',
      value: metrics.activeAdmins,
      iconClass: 'sa-icon-emerald',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      subtext: '100% operational coverage',
      route: '/super-admin/admins',
    },
    {
      id: 'customers',
      label: 'Total EV Customers',
      value: metrics.totalCustomers,
      iconClass: 'sa-icon-indigo',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
      subtext: `${metrics.activeCustomers} active users`,
      route: '/super-admin/customers',
    },
    {
      id: 'active_customers',
      label: 'Active Customers',
      value: metrics.activeCustomers,
      iconClass: 'sa-icon-cyan',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      subtext: `${Math.round((metrics.activeCustomers / (metrics.totalCustomers || 1)) * 100)}% network engagement`,
      route: '/super-admin/customers',
    },
    {
      id: 'new_customers',
      label: 'New Customers (Period)',
      value: `+${metrics.newCustomers}`,
      iconClass: 'sa-icon-lime',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
      delta: `+${metrics.periodComparison.customerGrowthPercent}% vs prior period`,
      deltaType: 'up',
      route: '/super-admin/customers',
    },
    {
      id: 'collections',
      label: 'Total Customer Collections',
      value: formatINR(metrics.totalSuccessfulCustomerCollectionsINR),
      iconClass: 'sa-icon-lime',
      highlight: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
      delta: `+${metrics.periodComparison.collectionsGrowthPercent}% revenue growth`,
      deltaType: 'up',
      route: '/super-admin/payments',
    },
    {
      id: 'receipts',
      label: 'Actual Business Receipts',
      value: formatINR(metrics.actualBusinessReceiptsINR),
      iconClass: 'sa-icon-emerald',
      highlight: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      subtext: 'Verified in bank account',
      route: '/super-admin/settlements',
    },
    {
      id: 'settlements',
      label: 'Outstanding Admin Settlements',
      value: formatINR(metrics.outstandingAdminSettlementsINR),
      iconClass: 'sa-icon-amber',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      subtext: 'Pending admin remittance',
      route: '/super-admin/settlements',
    },
    {
      id: 'pending_payments',
      label: 'Pending Customer Debt',
      value: formatINR(metrics.pendingCustomerPaymentsINR),
      iconClass: 'sa-icon-rose',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      subtext: 'Uncollected spot charging fees',
      route: '/super-admin/customers',
    },
    {
      id: 'refunds',
      label: 'Refunds & Reversals',
      value: formatINR(metrics.refundsAndReversalsINR),
      iconClass: 'sa-icon-rose',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <polyline points="23 20 23 14 17 14" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        </svg>
      ),
      subtext: 'Connector trip & disputed sessions',
      route: '/super-admin/payments',
    },
    {
      id: 'commission',
      label: 'Admin Commission (Earned)',
      value: formatINR(metrics.adminCommissionsINR),
      iconClass: 'sa-icon-indigo',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      subtext: 'Contractual 4.5% - 5% regional rate',
      route: '/super-admin/admins',
    },
  ];

  return (
    <div className="sa-metrics-grid">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`sa-metric-card ${card.highlight ? 'sa-metric-card--highlight' : ''}`}
          onClick={() => navigate(card.route)}
          title={`Click to view ${card.label} records`}
          role="button"
          tabIndex={0}
        >
          <div className="sa-metric-card__top">
            <span className="sa-metric-card__label">{card.label}</span>
            <div className={`sa-metric-card__icon-wrap ${card.iconClass}`}>
              {card.icon}
            </div>
          </div>

          <div className="sa-metric-card__value">{card.value}</div>

          <div className="sa-metric-card__bottom">
            {card.delta ? (
              <span className={`sa-metric-card__delta sa-delta-${card.deltaType}`}>
                {card.deltaType === 'up' ? '↑ ' : card.deltaType === 'down' ? '↓ ' : ''}
                {card.delta}
              </span>
            ) : (
              <span>{card.subtext}</span>
            )}
            <span style={{ fontSize: '0.7rem', color: 'var(--sa-lime)', fontWeight: 700 }}>
              Details →
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
