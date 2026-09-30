import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import { AdminReportsData, AdminZonePerformance } from '../../types/admin';
import './AdminReports.css';

type QuickPeriod = '7D' | '30D' | '3M' | '6M' | '1Y';

export const AdminReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<QuickPeriod | 'Custom'>('6M');
  const [startDate, setStartDate] = useState('2024-07-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [reportData, setReportData] = useState<AdminReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData(selectedPeriod, startDate, endDate);
  }, [selectedPeriod, startDate, endDate]);

  const fetchReportData = async (period: string, start: string, end: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getReportsData(period, start, end);
      setReportData(data);
    } catch (err: any) {
      console.error('Failed to load reports data:', err);
      setError('Unable to load report data. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period: QuickPeriod) => {
    setSelectedPeriod(period);
    // Adjust dates based on period
    const today = new Date('2024-12-31');
    let start = new Date(today);

    if (period === '7D') {
      start.setDate(today.getDate() - 7);
    } else if (period === '30D') {
      start.setDate(today.getDate() - 30);
    } else if (period === '3M') {
      start.setMonth(today.getMonth() - 3);
    } else if (period === '6M') {
      start.setMonth(today.getMonth() - 6);
    } else if (period === '1Y') {
      start.setFullYear(today.getFullYear() - 1);
    }

    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(today.toISOString().slice(0, 10));
  };

  const handleCustomDateChange = (type: 'start' | 'end', val: string) => {
    setSelectedPeriod('Custom');
    if (type === 'start') {
      setStartDate(val);
    } else {
      setEndDate(val);
    }
  };

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDisplayDate = (isoStr: string): string => {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return isoStr;
  };

  // CSV Export
  const handleExportCSV = async () => {
    if (!reportData) return;
    setIsExportingCSV(true);
    try {
      await new Promise((res) => setTimeout(res, 600));

      const rows: string[][] = [
        ['POWERGRID EV CHARGING PLATFORM - ANALYTICS & PERFORMANCE REPORT'],
        [`Generated: ${new Date().toLocaleString('en-IN')}`],
        [`Period: ${selectedPeriod} (${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)})`],
        [''],
        ['SUMMARY METRICS'],
        ['Total Revenue (INR)', String(reportData.summary.totalRevenueINR)],
        ['Total Energy (kWh)', String(reportData.summary.totalEnergyKWh)],
        ['Total Charging Sessions', String(reportData.summary.totalSessions)],
        ['Average Grid Utilization', `${reportData.summary.avgUtilizationPercent}%`],
        [''],
        ['ZONE PERFORMANCE COMPARISON'],
        ['Zone Code', 'Zone Name', 'Sessions', 'Energy Delivered (kWh)', 'Revenue (INR)', 'Utilization', 'Performance'],
      ];

      reportData.zonePerformance.forEach((z) => {
        rows.push([
          z.zoneCode,
          z.zoneName || '',
          String(z.sessions),
          String(z.energyKWh),
          String(z.revenueINR),
          `${z.utilizationPercent}%`,
          z.performance,
        ]);
      });

      rows.push(['']);
      rows.push(['VEHICLE CATEGORY BREAKDOWN']);
      rows.push(['Vehicle Category', 'Sessions', 'Energy (kWh)', 'Revenue (INR)']);
      reportData.vehicleCategories.forEach((v) => {
        rows.push([v.category, String(v.sessions), String(v.energyKWh), String(v.revenueINR)]);
      });

      rows.push(['']);
      rows.push(['MONTHLY / TIMELINE TRENDS']);
      rows.push(['Period/Month', 'Revenue (INR)', 'Energy (kWh)', 'CAR Sessions', 'BIKE Sessions', 'BUS Sessions']);
      reportData.monthlyMetrics.forEach((m) => {
        rows.push([
          m.month,
          String(m.revenueINR),
          String(m.energyKWh),
          String(m.carSessions),
          String(m.bikeSessions),
          String(m.busSessions),
        ]);
      });

      const csvContent = '\uFEFF' + rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `powergrid-report-${startDate}_to_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage('CSV Report exported successfully.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      setToastMessage('Error exporting CSV.');
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsExportingCSV(false);
    }
  };

  // PDF Export via Printable Frame
  const handleExportPDF = async () => {
    if (!reportData) return;
    setIsExportingPDF(true);
    try {
      await new Promise((res) => setTimeout(res, 600));

      const printWindow = window.open('', '_blank', 'width=900,height=800');
      if (!printWindow) {
        alert('Please allow popups to generate the PDF report.');
        setIsExportingPDF(false);
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>PowerGrid Analytics Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #09131f; padding: 24px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #bef264; padding-bottom: 12px; margin-bottom: 20px; }
            .brand { font-size: 22px; font-weight: 800; color: #09131f; }
            .brand span { color: #65a30d; }
            .period { font-size: 13px; color: #64748b; }
            .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
            .card-lbl { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
            .card-val { font-size: 18px; font-weight: 800; color: #09131f; margin-top: 4px; }
            h2 { font-size: 15px; font-weight: 700; margin: 16px 0 8px; color: #09131f; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
            th { background: #f1f5f9; text-align: left; padding: 8px 10px; font-weight: 700; color: #334155; border-bottom: 1px solid #cbd5e1; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
            .high { color: #06b6d4; font-weight: 700; }
            .moderate { color: #65a30d; font-weight: 700; }
            .low { color: #64748b; font-weight: 700; }
            @media print {
              body { padding: 0; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">Power<span>Grid</span> EV Network</div>
              <div style="font-size: 13px; color: #475569; margin-top: 2px;">Analytics & Performance Report</div>
            </div>
            <div style="text-align: right;">
              <div class="period">Range: <strong>${formatDisplayDate(startDate)}</strong> to <strong>${formatDisplayDate(endDate)}</strong></div>
              <div class="period">Scope: <strong>${selectedPeriod} View</strong></div>
            </div>
          </div>

          <div class="summary-cards">
            <div class="card">
              <div class="card-lbl">Total Revenue</div>
              <div class="card-val">${formatCurrency(reportData.summary.totalRevenueINR)}</div>
            </div>
            <div class="card">
              <div class="card-lbl">Total Energy Delivered</div>
              <div class="card-val">${reportData.summary.totalEnergyKWh.toLocaleString()} kWh</div>
            </div>
            <div class="card">
              <div class="card-lbl">Charging Sessions</div>
              <div class="card-val">${reportData.summary.totalSessions.toLocaleString()}</div>
            </div>
            <div class="card">
              <div class="card-lbl">Avg Grid Utilization</div>
              <div class="card-val">${reportData.summary.avgUtilizationPercent}%</div>
            </div>
          </div>

          <h2>Zone Performance Comparison</h2>
          <table>
            <thead>
              <tr>
                <th>ZONE</th>
                <th>SESSIONS</th>
                <th>ENERGY (KWH)</th>
                <th>REVENUE</th>
                <th>UTILIZATION</th>
                <th>PERFORMANCE</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.zonePerformance
                .map(
                  (z) => `
                <tr>
                  <td><strong>${z.zoneCode}</strong> ${z.zoneName ? `· ${z.zoneName}` : ''}</td>
                  <td>${z.sessions}</td>
                  <td>${z.energyKWh}</td>
                  <td><strong>${formatCurrency(z.revenueINR)}</strong></td>
                  <td>${z.utilizationPercent}%</td>
                  <td class="${z.performance.toLowerCase()}">${z.performance}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <h2>Vehicle Category Analysis</h2>
          <table>
            <thead>
              <tr>
                <th>CATEGORY</th>
                <th>SESSIONS</th>
                <th>ENERGY (KWH)</th>
                <th>REVENUE (INR)</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.vehicleCategories
                .map(
                  (v) => `
                <tr>
                  <td><strong>${v.category}</strong></td>
                  <td>${v.sessions} sessions</td>
                  <td>${v.energyKWh} kWh</td>
                  <td><strong>${formatCurrency(v.revenueINR)}</strong></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            PowerGrid Admin Platform · Confidential Internal Telemetry Report
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      setToastMessage('PDF printable preview generated.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Calculations for Line & Bar Charts
  const monthlyData = reportData?.monthlyMetrics || [];

  // Chart 1: Revenue Trend (Y: 0 to 160k)
  const maxRevenue = 160000;
  const revenuePoints = useMemo(() => {
    if (!monthlyData.length) return '';
    const width = 500;
    const height = 180;
    const paddingLeft = 10;
    const paddingRight = 10;
    const usableWidth = width - paddingLeft - paddingRight;

    return monthlyData
      .map((item, idx) => {
        const x = paddingLeft + (idx / (monthlyData.length - 1 || 1)) * usableWidth;
        const y = height - (item.revenueINR / maxRevenue) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }, [monthlyData]);

  // Chart 3: Energy Consumption (Y: 0 to 10000)
  const maxEnergy = 10000;
  const energyPoints = useMemo(() => {
    if (!monthlyData.length) return [];
    const width = 500;
    const height = 180;
    const paddingLeft = 10;
    const paddingRight = 10;
    const usableWidth = width - paddingLeft - paddingRight;

    return monthlyData.map((item, idx) => {
      const x = paddingLeft + (idx / (monthlyData.length - 1 || 1)) * usableWidth;
      const y = height - (item.energyKWh / maxEnergy) * height;
      return { x, y, kwh: item.energyKWh, month: item.month };
    });
  }, [monthlyData]);

  return (
    <div className="pg-admin-reports-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="pg-admin-reports-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="pg-admin-reports-header">
        <div className="pg-admin-reports-heading">
          <h1 className="pg-admin-reports-title">Analytics & Reports</h1>
          <p className="pg-admin-reports-subtitle">Network performance insights</p>
        </div>

        {/* Action Buttons: CSV & PDF Export */}
        <div className="pg-admin-reports-export-group">
          <button
            type="button"
            className="pg-admin-reports-export-button"
            onClick={handleExportCSV}
            disabled={isExportingCSV || isLoading || !reportData}
            aria-label="Export report as CSV"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isExportingCSV ? 'Exporting...' : 'CSV'}</span>
          </button>

          <button
            type="button"
            className="pg-admin-reports-export-button"
            onClick={handleExportPDF}
            disabled={isExportingPDF || isLoading || !reportData}
            aria-label="Export report as PDF"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isExportingPDF ? 'Generating...' : 'PDF'}</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Toolbar (Quick Filters + Date Range) */}
      <div className="pg-admin-reports-toolbar">
        {/* Quick Date Filters */}
        <div className="pg-admin-reports-period-filter">
          {(['7D', '30D', '3M', '6M', '1Y'] as QuickPeriod[]).map((period) => (
            <button
              key={period}
              type="button"
              className={`pg-admin-reports-period-button ${
                selectedPeriod === period ? 'pg-admin-reports-period-button--active' : ''
              }`}
              onClick={() => handlePeriodChange(period)}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Custom Date Range Picker */}
        <div className="pg-admin-reports-date-range">
          <div className="pg-admin-reports-date-box">
            <input
              type="date"
              className="pg-admin-reports-date-input"
              value={startDate}
              max={endDate}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              aria-label="Start date"
            />
          </div>
          <span className="pg-admin-reports-date-separator">to</span>
          <div className="pg-admin-reports-date-box">
            <input
              type="date"
              className="pg-admin-reports-date-input"
              value={endDate}
              min={startDate}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              aria-label="End date"
            />
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="pg-admin-reports-error-box">
          <span className="pg-admin-reports-error-icon">⚠</span>
          <div className="pg-admin-reports-error-text">
            <strong>{error}</strong>
            <button
              type="button"
              className="pg-admin-reports-retry-btn"
              onClick={() => fetchReportData(selectedPeriod, startDate, endDate)}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="pg-admin-reports-loading">
          <div className="pg-admin-reports-spinner" />
          <p>Loading telemetry & analytics...</p>
        </div>
      )}

      {/* Content Grid */}
      {!isLoading && reportData && (
        <>
          {/* Row 1 Charts: Revenue Trend & Charging Sessions */}
          <div className="pg-admin-reports-chart-grid">
            {/* Chart 1: Revenue Trend */}
            <div className="pg-admin-reports-chart-card">
              <div className="pg-admin-reports-chart-header">
                <h2 className="pg-admin-reports-chart-title">Revenue Trend</h2>
                <p className="pg-admin-reports-chart-subtitle">Monthly revenue (₹)</p>
              </div>

              <div className="pg-admin-reports-chart-body">
                <div className="pg-admin-reports-line-chart-wrapper">
                  {/* Y-Axis Labels */}
                  <div className="pg-admin-reports-y-axis">
                    <span>₹160k</span>
                    <span>₹120k</span>
                    <span>₹80k</span>
                    <span>₹40k</span>
                    <span>₹0k</span>
                  </div>

                  {/* SVG Chart Area */}
                  <div className="pg-admin-reports-chart-canvas">
                    <svg
                      viewBox="0 0 500 180"
                      className="pg-admin-reports-svg-chart"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="pgRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#bef264" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#bef264" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="45" x2="500" y2="45" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="135" x2="500" y2="135" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" />

                      {/* Gradient Fill under the line */}
                      {revenuePoints && (
                        <polygon
                          points={`10,180 ${revenuePoints} 490,180`}
                          fill="url(#pgRevenueGrad)"
                        />
                      )}

                      {/* Line */}
                      {revenuePoints && (
                        <polyline
                          fill="none"
                          stroke="#a3e635"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={revenuePoints}
                        />
                      )}
                    </svg>

                    {/* X-Axis Labels */}
                    <div className="pg-admin-reports-x-axis">
                      {monthlyData.map((m, idx) => (
                        <span key={idx}>{m.month}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 2: Charging Sessions By Vehicle */}
            <div className="pg-admin-reports-chart-card">
              <div className="pg-admin-reports-chart-header">
                <h2 className="pg-admin-reports-chart-title">Charging Sessions</h2>
                <p className="pg-admin-reports-chart-subtitle">By vehicle category</p>
              </div>

              <div className="pg-admin-reports-chart-body">
                <div className="pg-admin-reports-bar-chart-wrapper">
                  {/* Y-Axis */}
                  <div className="pg-admin-reports-y-axis">
                    <span>360</span>
                    <span>270</span>
                    <span>180</span>
                    <span>90</span>
                    <span>0</span>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="pg-admin-reports-chart-canvas">
                    <svg
                      viewBox="0 0 500 180"
                      className="pg-admin-reports-svg-chart"
                      preserveAspectRatio="none"
                    >
                      {/* Grid Lines */}
                      <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="45" x2="500" y2="45" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="135" x2="500" y2="135" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" />

                      {/* Grouped Bars */}
                      {monthlyData.map((item, idx) => {
                        const maxVal = 360;
                        const groupWidth = 500 / (monthlyData.length || 1);
                        const groupCenterX = idx * groupWidth + groupWidth / 2;
                        const barW = 10;
                        const gap = 3;

                        // CAR bar (Cyan)
                        const carH = (item.carSessions / maxVal) * 180;
                        const carX = groupCenterX - barW * 1.5 - gap;
                        const carY = 180 - carH;

                        // BIKE bar (Lime)
                        const bikeH = (item.bikeSessions / maxVal) * 180;
                        const bikeX = groupCenterX - barW / 2;
                        const bikeY = 180 - bikeH;

                        // BUS bar (Orange)
                        const busH = (item.busSessions / maxVal) * 180;
                        const busX = groupCenterX + barW / 2 + gap;
                        const busY = 180 - busH;

                        return (
                          <g key={idx}>
                            {/* CAR Bar */}
                            <rect
                              x={carX}
                              y={carY}
                              width={barW}
                              height={carH}
                              fill="#06b6d4"
                              rx="2"
                            />
                            {/* BIKE Bar */}
                            <rect
                              x={bikeX}
                              y={bikeY}
                              width={barW}
                              height={bikeH}
                              fill="#bef264"
                              rx="2"
                            />
                            {/* BUS Bar */}
                            <rect
                              x={busX}
                              y={busY}
                              width={barW}
                              height={busH}
                              fill="#f97316"
                              rx="2"
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* X-Axis */}
                    <div className="pg-admin-reports-x-axis">
                      {monthlyData.map((m, idx) => (
                        <span key={idx}>{m.month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend Below Bar Chart */}
                <div className="pg-admin-reports-chart-legend">
                  <div className="pg-admin-reports-legend-item">
                    <span className="pg-admin-reports-legend-dot pg-admin-reports-legend-dot--cyan" />
                    <span>CAR</span>
                  </div>
                  <div className="pg-admin-reports-legend-item">
                    <span className="pg-admin-reports-legend-dot pg-admin-reports-legend-dot--lime" />
                    <span>BIKE</span>
                  </div>
                  <div className="pg-admin-reports-legend-item">
                    <span className="pg-admin-reports-legend-dot pg-admin-reports-legend-dot--orange" />
                    <span>BUS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 Charts: Energy Consumption & Vehicle Category Analysis */}
          <div className="pg-admin-reports-chart-grid" style={{ marginTop: '24px' }}>
            {/* Chart 3: Energy Consumption */}
            <div className="pg-admin-reports-chart-card">
              <div className="pg-admin-reports-chart-header">
                <h2 className="pg-admin-reports-chart-title">Energy Consumption</h2>
                <p className="pg-admin-reports-chart-subtitle">Monthly kWh delivered</p>
              </div>

              <div className="pg-admin-reports-chart-body">
                <div className="pg-admin-reports-line-chart-wrapper">
                  {/* Y-Axis */}
                  <div className="pg-admin-reports-y-axis">
                    <span>10000</span>
                    <span>7500</span>
                    <span>5000</span>
                    <span>2500</span>
                    <span>0</span>
                  </div>

                  {/* SVG Chart */}
                  <div className="pg-admin-reports-chart-canvas">
                    <svg
                      viewBox="0 0 500 180"
                      className="pg-admin-reports-svg-chart"
                      preserveAspectRatio="none"
                    >
                      {/* Grid Lines */}
                      <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="45" x2="500" y2="45" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="135" x2="500" y2="135" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" />

                      {/* Line */}
                      {energyPoints.length > 0 && (
                        <polyline
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={energyPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                        />
                      )}

                      {/* Circular Points */}
                      {energyPoints.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          fill="#06b6d4"
                        />
                      ))}
                    </svg>

                    {/* X-Axis */}
                    <div className="pg-admin-reports-x-axis">
                      {monthlyData.map((m, idx) => (
                        <span key={idx}>{m.month}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 4: Vehicle Category Analysis */}
            <div className="pg-admin-reports-chart-card">
              <div className="pg-admin-reports-chart-header">
                <h2 className="pg-admin-reports-chart-title">Vehicle Category Analysis</h2>
                <p className="pg-admin-reports-chart-subtitle">Sessions, Energy & Revenue</p>
              </div>

              <div className="pg-admin-reports-chart-body pg-admin-reports-vehicle-analysis-body">
                {reportData.vehicleCategories.map((v) => {
                  const colorClass =
                    v.category === 'CAR' ? 'cyan' : v.category === 'BIKE' ? 'lime' : 'orange';

                  return (
                    <div key={v.category} className="pg-admin-reports-vehicle-row">
                      <div className="pg-admin-reports-vehicle-top">
                        <div className="pg-admin-reports-vehicle-label-group">
                          <span
                            className={`pg-admin-reports-vehicle-dot pg-admin-reports-vehicle-dot--${colorClass}`}
                          />
                          <span className="pg-admin-reports-vehicle-title">{v.category}</span>
                        </div>

                        <div className="pg-admin-reports-vehicle-metrics">
                          <span>{v.sessions} sessions</span>
                          <span className="pg-admin-reports-dot-sep">·</span>
                          <span>{v.energyKWh} kWh</span>
                          <span className="pg-admin-reports-dot-sep">·</span>
                          <span className="pg-admin-reports-vehicle-rev">
                            {formatCurrency(v.revenueINR)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pg-admin-reports-vehicle-progress">
                        <div
                          className={`pg-admin-reports-vehicle-progress-fill pg-admin-reports-vehicle-progress-fill--${colorClass}`}
                          style={{ width: `${Math.min(100, Math.max(0, v.progressPercent))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Zone Performance Comparison Table */}
          <div className="pg-admin-reports-zone-section">
            <div className="pg-admin-reports-zone-header">
              <h2 className="pg-admin-reports-zone-title">Zone Performance Comparison</h2>
              <p className="pg-admin-reports-zone-subtitle">Revenue and utilization by zone</p>
            </div>

            {/* Desktop Table View */}
            <div className="pg-admin-reports-zone-table-shell">
              <table className="pg-admin-reports-zone-table">
                <thead>
                  <tr className="pg-admin-reports-zone-row">
                    <th className="pg-admin-reports-zone-cell">ZONE</th>
                    <th className="pg-admin-reports-zone-cell">SESSIONS</th>
                    <th className="pg-admin-reports-zone-cell">ENERGY (KWH)</th>
                    <th className="pg-admin-reports-zone-cell">REVENUE</th>
                    <th className="pg-admin-reports-zone-cell">UTILIZATION</th>
                    <th className="pg-admin-reports-zone-cell">PERFORMANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.zonePerformance.map((zone: AdminZonePerformance) => {
                    const perfClass = zone.performance.toLowerCase();
                    const utilColorClass =
                      zone.utilizationPercent >= 70
                        ? 'cyan'
                        : zone.utilizationPercent >= 40
                        ? 'lime'
                        : 'gray';

                    return (
                      <tr key={zone.zoneCode} className="pg-admin-reports-zone-row">
                        {/* ZONE */}
                        <td className="pg-admin-reports-zone-cell">
                          <strong className="pg-admin-reports-zone-code">{zone.zoneCode}</strong>
                        </td>

                        {/* SESSIONS */}
                        <td className="pg-admin-reports-zone-cell">{zone.sessions}</td>

                        {/* ENERGY (KWH) */}
                        <td className="pg-admin-reports-zone-cell">{zone.energyKWh}</td>

                        {/* REVENUE */}
                        <td className="pg-admin-reports-zone-cell">
                          <strong className="pg-admin-reports-zone-rev">
                            {formatCurrency(zone.revenueINR)}
                          </strong>
                        </td>

                        {/* UTILIZATION */}
                        <td className="pg-admin-reports-zone-cell">
                          <div className="pg-admin-reports-utilization">
                            <div className="pg-admin-reports-utilization-track">
                              <div
                                className={`pg-admin-reports-utilization-fill pg-admin-reports-utilization-fill--${utilColorClass}`}
                                style={{ width: `${zone.utilizationPercent}%` }}
                              />
                            </div>
                            <span className="pg-admin-reports-utilization-val">
                              {zone.utilizationPercent}%
                            </span>
                          </div>
                        </td>

                        {/* PERFORMANCE */}
                        <td className="pg-admin-reports-zone-cell">
                          <span
                            className={`pg-admin-reports-performance pg-admin-reports-performance--${perfClass}`}
                          >
                            {zone.performance}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< 768px) */}
            <div className="pg-admin-reports-mobile-zone-list">
              {reportData.zonePerformance.map((zone: AdminZonePerformance) => {
                const perfClass = zone.performance.toLowerCase();
                const utilColorClass =
                  zone.utilizationPercent >= 70
                    ? 'cyan'
                    : zone.utilizationPercent >= 40
                    ? 'lime'
                    : 'gray';

                return (
                  <div key={zone.zoneCode} className="pg-admin-reports-mobile-zone-card">
                    <div className="pg-admin-reports-mobile-zone-card-top">
                      <div>
                        <strong className="pg-admin-reports-zone-code">{zone.zoneCode}</strong>
                        {zone.zoneName && (
                          <div className="pg-admin-reports-mobile-zone-name">{zone.zoneName}</div>
                        )}
                      </div>
                      <span
                        className={`pg-admin-reports-performance pg-admin-reports-performance--${perfClass}`}
                      >
                        {zone.performance}
                      </span>
                    </div>

                    <div className="pg-admin-reports-mobile-zone-stats">
                      <div className="pg-admin-reports-mobile-stat">
                        <span>Sessions</span>
                        <strong>{zone.sessions}</strong>
                      </div>
                      <div className="pg-admin-reports-mobile-stat">
                        <span>Energy</span>
                        <strong>{zone.energyKWh} kWh</strong>
                      </div>
                      <div className="pg-admin-reports-mobile-stat">
                        <span>Revenue</span>
                        <strong className="pg-admin-reports-zone-rev">
                          {formatCurrency(zone.revenueINR)}
                        </strong>
                      </div>
                    </div>

                    <div className="pg-admin-reports-mobile-zone-util">
                      <div className="pg-admin-reports-mobile-util-header">
                        <span>Grid Utilization</span>
                        <strong>{zone.utilizationPercent}%</strong>
                      </div>
                      <div className="pg-admin-reports-utilization-track">
                        <div
                          className={`pg-admin-reports-utilization-fill pg-admin-reports-utilization-fill--${utilColorClass}`}
                          style={{ width: `${zone.utilizationPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;
