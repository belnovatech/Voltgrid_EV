import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';

export const BusinessInsights: React.FC = () => {
  const { areas, admins } = useSuperAdmin();

  // Top collections
  const sortedByCollections = [...admins].sort(
    (a, b) => b.totalCustomerCollectionsINR - a.totalCustomerCollectionsINR
  );
  const topCollectionAdmin = sortedByCollections[0];

  // Top customer growth
  const sortedByGrowth = [...admins].sort((a, b) => b.newCustomers - a.newCustomers);
  const topGrowthAdmin = sortedByGrowth[0];

  // Admins with outstanding settlements
  const adminsWithOutstanding = admins.filter((a) => a.outstandingSettlementINR > 0);

  // Area with highest customers
  const sortedAreas = [...areas].sort((a, b) => b.totalCustomers - a.totalCustomers);
  const topArea = sortedAreas[0];

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="sa-card" style={{ marginBottom: 20 }}>
      <div className="sa-card__header">
        <div>
          <h3 className="sa-card__title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sa-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Automated Executive Business Insights
          </h3>
          <p className="sa-card__subtitle">
            Real-time algorithmic highlights across operational areas and assigned admin accounts
          </p>
        </div>
        <span className="sa-status-badge sa-status-badge--active">
          Live Reconciliation
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {/* Highest Collections */}
        <div
          style={{
            background: 'var(--sa-bg-surface-elevated)',
            border: '1px solid var(--sa-border)',
            borderRadius: 'var(--sa-radius-md)',
            padding: '16px',
            borderLeft: '4px solid var(--sa-lime)',
          }}
        >
          <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
            Highest Collections
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px 0' }}>
            {topCollectionAdmin ? topCollectionAdmin.name : 'All Admins'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--sa-lime)', fontWeight: 700 }}>
            {topCollectionAdmin ? formatINR(topCollectionAdmin.totalCustomerCollectionsINR) : '₹0'} gross collected
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--sa-text-dim)', marginTop: 4 }}>
            Serving {topCollectionAdmin?.assignedAreaNames.join(', ')}
          </div>
        </div>

        {/* Highest Customer Growth */}
        <div
          style={{
            background: 'var(--sa-bg-surface-elevated)',
            border: '1px solid var(--sa-border)',
            borderRadius: 'var(--sa-radius-md)',
            padding: '16px',
            borderLeft: '4px solid var(--sa-cyan)',
          }}
        >
          <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
            Highest Customer Growth
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px 0' }}>
            {topGrowthAdmin ? topGrowthAdmin.name : 'State Hub'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--sa-cyan)', fontWeight: 700 }}>
            +{topGrowthAdmin ? topGrowthAdmin.newCustomers : 0} new drivers onboarding
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--sa-text-dim)', marginTop: 4 }}>
            Total registered customer base: {topGrowthAdmin?.totalCustomers}
          </div>
        </div>

        {/* Top Regional Hub */}
        <div
          style={{
            background: 'var(--sa-bg-surface-elevated)',
            border: '1px solid var(--sa-border)',
            borderRadius: 'var(--sa-radius-md)',
            padding: '16px',
            borderLeft: '4px solid var(--sa-emerald)',
          }}
        >
          <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
            Largest Customer Hub
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px 0' }}>
            {topArea ? topArea.name : 'Regional Zone'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--sa-emerald)', fontWeight: 700 }}>
            {topArea ? topArea.totalCustomers : 0} drivers registered ({topArea?.growthRatePercent}% YoY)
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--sa-text-dim)', marginTop: 4 }}>
            {topArea ? topArea.totalChargers : 0} high-speed fast chargers deployed
          </div>
        </div>

        {/* Outstanding Settlement Attention */}
        <div
          style={{
            background: 'var(--sa-bg-surface-elevated)',
            border: '1px solid var(--sa-border)',
            borderRadius: 'var(--sa-radius-md)',
            padding: '16px',
            borderLeft: '4px solid var(--sa-amber)',
          }}
        >
          <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
            Settlement Status
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px 0' }}>
            {adminsWithOutstanding.length} Admins with Pending Tranches
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--sa-amber)', fontWeight: 700 }}>
            Reconciliation due by 5th of month
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--sa-text-dim)', marginTop: 4 }}>
            All active accounts in good operational standing
          </div>
        </div>
      </div>
    </div>
  );
};
