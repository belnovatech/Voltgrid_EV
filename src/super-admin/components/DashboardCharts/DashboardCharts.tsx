import React from 'react';

export const DashboardCharts: React.FC = () => {

  // Trend data points (Daily collections & receipts over last 7 days)
  const trendDays = [
    { day: 'Wed 22', collections: 42000, receipts: 39500 },
    { day: 'Thu 23', collections: 51200, receipts: 48000 },
    { day: 'Fri 24', collections: 63400, receipts: 59000 },
    { day: 'Sat 25', collections: 78500, receipts: 71200 },
    { day: 'Sun 26', collections: 84200, receipts: 79000 },
    { day: 'Mon 27', collections: 61000, receipts: 57400 },
    { day: 'Tue 28', collections: 74800, receipts: 69500 },
  ];

  const maxVal = Math.max(...trendDays.map((d) => d.collections));

  // Payment method breakdown
  const paymentMethods = [
    { name: 'UPI (GPay / PhonePe / Paytm)', count: '64%', color: 'var(--sa-lime)', amount: '₹18,88,000' },
    { name: 'Credit / Debit Cards', count: '22%', color: 'var(--sa-cyan)', amount: '₹6,49,000' },
    { name: 'Net Banking & RTGS', count: '10%', color: 'var(--sa-indigo)', amount: '₹2,95,000' },
    { name: 'Eway Smart Wallet', count: '4%', color: 'var(--sa-amber)', amount: '₹1,18,000' },
  ];

  return (
    <div className="sa-charts-grid" style={{ marginBottom: 24 }}>
      {/* Primary Trend Chart */}
      <div className="sa-card">
        <div className="sa-card__header">
          <div>
            <h3 className="sa-card__title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sa-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              Financial Velocity: Collections vs Business Receipts
            </h3>
            <p className="sa-card__subtitle">
              Daily comparative volume (Customer Payments vs Verified Business Inflows)
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--sa-text-muted)' }}>
              <span style={{ width: 10, height: 10, background: 'var(--sa-lime)', borderRadius: 2 }} />
              Customer Collections
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--sa-text-muted)' }}>
              <span style={{ width: 10, height: 10, background: 'var(--sa-cyan)', borderRadius: 2 }} />
              Business Receipts
            </div>
          </div>
        </div>

        {/* Responsive Bar Graphic */}
        <div
          style={{
            height: '240px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '14px',
            paddingTop: '20px',
            borderBottom: '1px solid var(--sa-border)',
            paddingBottom: '8px',
          }}
        >
          {trendDays.map((d) => {
            const hCol = Math.round((d.collections / maxVal) * 190);
            const hRec = Math.round((d.receipts / maxVal) * 190);
            return (
              <div
                key={d.day}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  gap: 4,
                }}
              >
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                  {/* Collections Bar */}
                  <div
                    style={{
                      width: '45%',
                      maxWidth: '24px',
                      height: `${hCol}px`,
                      background: 'linear-gradient(180deg, var(--sa-lime) 0%, rgba(154, 230, 0, 0.4) 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease',
                    }}
                    title={`Collections: ₹${d.collections.toLocaleString()}`}
                  />
                  {/* Receipts Bar */}
                  <div
                    style={{
                      width: '45%',
                      maxWidth: '24px',
                      height: `${hRec}px`,
                      background: 'linear-gradient(180deg, var(--sa-cyan) 0%, rgba(6, 182, 212, 0.4) 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease',
                    }}
                    title={`Receipts: ₹${d.receipts.toLocaleString()}`}
                  />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--sa-text-muted)', whiteSpace: 'nowrap', marginTop: 6 }}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method & Area Distribution */}
      <div className="sa-card">
        <div className="sa-card__header">
          <div>
            <h3 className="sa-card__title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sa-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Payment Gateways & Methods
            </h3>
            <p className="sa-card__subtitle">Aggregated customer settlement rails</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {paymentMethods.map((m) => (
            <div key={m.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--sa-text)', fontWeight: 600 }}>{m.name}</span>
                <span style={{ color: m.color, fontWeight: 700 }}>
                  {m.count} ({m.amount})
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: 'var(--sa-bg-surface-elevated)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: m.count,
                    background: m.color,
                    borderRadius: 4,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 12,
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--sa-radius-md)',
            border: '1px solid var(--sa-border)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--sa-text-muted)',
          }}
        >
          <span>Payment Gateway Health</span>
          <span style={{ color: 'var(--sa-emerald)', fontWeight: 700 }}>● 99.98% Success Rate</span>
        </div>
      </div>
    </div>
  );
};
