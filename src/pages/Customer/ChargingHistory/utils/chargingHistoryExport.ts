import * as XLSX from 'xlsx';
import { ChargingHistoryItem } from '../../../../types/customer';

export interface ExportFilterInfo {
  statusFilter?: string;
  vehicleTypeFilter?: string;
  startDate?: string;
  endDate?: string;
  stationName?: string;
}

export const exportChargingHistoryToExcel = (
  sessions: ChargingHistoryItem[],
  filters?: ExportFilterInfo
) => {
  // 1. Prepare Summary Sheet data
  const totalSessions = sessions.length;
  const totalEnergy = sessions.reduce((sum, s) => sum + (s.energyConsumedKWh || 0), 0);
  const totalSpent = sessions.reduce((sum, s) => sum + (s.totalCostINR || 0), 0);
  const totalDuration = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
  const now = new Date();
  const generatedAt = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const summaryData = [
    ['POWERGRID EV CHARGING PLATFORM'],
    ['Customer Charging History & Tax Audit Report'],
    [],
    ['Report Metadata', ''],
    ['Generated On', generatedAt],
    ['Customer Name', 'Bala Krishna'],
    ['Active Status Filter', filters?.statusFilter || 'All Statuses'],
    ['Vehicle Category Filter', filters?.vehicleTypeFilter || 'All Categories'],
    ['Date Range', filters?.startDate ? `${filters.startDate} to ${filters.endDate || 'Present'}` : 'All Time'],
    [],
    ['Consolidated Metrics', ''],
    ['Total Charging Sessions', totalSessions],
    ['Total Energy Consumed (kWh)', Math.round(totalEnergy * 100) / 100],
    ['Total Amount Spent (INR)', `₹${totalSpent.toFixed(2)}`],
    ['Average Session Duration (min)', `${avgDuration} min`],
  ];

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  summaryWs['!cols'] = [{ wch: 32 }, { wch: 32 }];

  // 2. Prepare Detailed Charging History Sheet data
  const historyRows = sessions.map((s, idx) => ({
    '#': idx + 1,
    'Session ID': s.id,
    'Station Name': s.stationName,
    'Address / City': s.stationAddress ? `${s.stationAddress}, ${s.city}` : s.city,
    'Charger ID': s.chargerId || 'N/A',
    'Vehicle Name': s.vehicleName,
    'Vehicle Category': (s.vehicleType || 'Car').toUpperCase(),
    'Energy Used (kWh)': s.energyConsumedKWh,
    'Duration (min)': s.durationMinutes,
    'Rate (₹/kWh)': s.ratePerKWh || 12,
    'Total Cost (₹)': s.totalCostINR,
    'Date': s.date,
    'Start Time': s.startTime || '—',
    'End Time': s.endTime || '—',
    'Status': s.status.charAt(0).toUpperCase() + s.status.slice(1),
  }));

  const historyWs = XLSX.utils.json_to_sheet(historyRows);

  // Set explicit column widths for perfect presentation in Excel / LibreOffice
  historyWs['!cols'] = [
    { wch: 5 },  // #
    { wch: 14 }, // Session ID
    { wch: 26 }, // Station Name
    { wch: 28 }, // Address / City
    { wch: 14 }, // Charger ID
    { wch: 20 }, // Vehicle Name
    { wch: 16 }, // Vehicle Category
    { wch: 18 }, // Energy Used (kWh)
    { wch: 16 }, // Duration (min)
    { wch: 14 }, // Rate (₹/kWh)
    { wch: 16 }, // Total Cost (₹)
    { wch: 14 }, // Date
    { wch: 12 }, // Start Time
    { wch: 12 }, // End Time
    { wch: 14 }, // Status
  ];

  // 3. Create Workbook & Append Sheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  XLSX.utils.book_append_sheet(wb, historyWs, 'Charging History');

  // 4. Generate clean sanitized filename
  const dateStr = now.toISOString().split('T')[0];
  const filterTag = filters?.vehicleTypeFilter && filters.vehicleTypeFilter !== 'All'
    ? `_${filters.vehicleTypeFilter}`
    : '';
  const filename = `PowerGrid_Charging_History${filterTag}_${dateStr}.xlsx`;

  // 5. Download .xlsx file directly
  XLSX.writeFile(wb, filename);
  return filename;
};
