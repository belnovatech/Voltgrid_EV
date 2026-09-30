import { ChargerQRPayload } from '../types/charging';

// Standard known chargers catalog for lookup and fallback validation
export const KNOWN_CHARGERS_CATALOG: Record<string, ChargerQRPayload> = {
  'CH-027': {
    chargerId: 'CH-027',
    stationId: 'ST-003',
    stationName: 'AP-Z03 Central Hub',
    location: 'Tirupati East, Andhra Pradesh',
    connectorType: 'CCS2',
    powerKw: 120,
    ratePerKwh: 12,
    isAvailable: true,
  },
  'CH-015': {
    chargerId: 'CH-015',
    stationId: 'ST-002',
    stationName: 'Visakhapatnam Port Supercharger',
    location: 'Beach Road, Visakhapatnam, Andhra Pradesh',
    connectorType: 'CCS2',
    powerKw: 120,
    ratePerKwh: 12,
    isAvailable: true,
  },
  'CH-005': {
    chargerId: 'CH-005',
    stationId: 'ST-001',
    stationName: 'Vijayawada Central Hub',
    location: 'MG Road, Vijayawada, Andhra Pradesh',
    connectorType: 'CCS2',
    powerKw: 120,
    ratePerKwh: 12,
    isAvailable: true,
  },
  'CH-028': {
    chargerId: 'CH-028',
    stationId: 'ST-004',
    stationName: 'Tirupati East Hub',
    location: 'Alipiri Road, Tirupati, Andhra Pradesh',
    connectorType: 'CCS2',
    powerKw: 60,
    ratePerKwh: 8,
    isAvailable: true,
  },
  'CH-001': {
    chargerId: 'CH-001',
    stationId: 'ST-005',
    stationName: 'Amaravati Capital Energy Center',
    location: 'Seed Access Road, Amaravati, Andhra Pradesh',
    connectorType: 'CCS2',
    powerKw: 150,
    ratePerKwh: 12,
    isAvailable: true,
  },
  'CH-099': {
    chargerId: 'CH-099',
    stationId: 'ST-009',
    stationName: 'Guntur City Express',
    location: 'Brodipet Main Road, Guntur',
    connectorType: 'Type 2',
    powerKw: 22,
    ratePerKwh: 8,
    isAvailable: false,
    statusText: 'Under scheduled maintenance. Please select another charger.',
  },
};

class QRScannerService {
  /**
   * Parse raw QR string or payload into ChargerQRPayload
   */
  parseQRString(rawCode: string): ChargerQRPayload | null {
    if (!rawCode || typeof rawCode !== 'string') return null;

    const trimmed = rawCode.trim();

    // 1. Try JSON format
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        const chargerId = parsed.chargerId || parsed.id || parsed.charger_id;
        if (chargerId) {
          return {
            chargerId: String(chargerId).toUpperCase(),
            stationId: parsed.stationId || parsed.station_id || 'ST-001',
            stationName: parsed.stationName || parsed.station_name || 'PowerGrid Station',
            location: parsed.location || parsed.address || 'Andhra Pradesh, India',
            connectorType: parsed.connectorType || parsed.connector || 'CCS2',
            powerKw: Number(parsed.powerKw || parsed.power || 120),
            ratePerKwh: Number(parsed.ratePerKwh || parsed.rate || 12),
            isAvailable: parsed.isAvailable !== false,
            statusText: parsed.statusText,
          };
        }
      } catch {
        // Fall through to other formats
      }
    }

    // 2. Try URL query param e.g. https://voltgrid.in/charge?id=CH-027
    if (trimmed.includes('http://') || trimmed.includes('https://') || trimmed.includes('?')) {
      try {
        const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
        const id = url.searchParams.get('id') || url.searchParams.get('charger') || url.pathname.split('/').pop();
        if (id) {
          const upperId = id.toUpperCase();
          if (KNOWN_CHARGERS_CATALOG[upperId]) {
            return { ...KNOWN_CHARGERS_CATALOG[upperId] };
          }
        }
      } catch {
        // ignore
      }
    }

    // 3. Try direct charger ID or prefix (e.g. CH-027 or VOLTGRID:CH-027)
    const match = trimmed.match(/CH[-\s]?(\d+)/i);
    if (match) {
      const standardId = `CH-${match[1].padStart(3, '0')}`;
      if (KNOWN_CHARGERS_CATALOG[standardId]) {
        return { ...KNOWN_CHARGERS_CATALOG[standardId] };
      }
      // Dynamic fallback for any CH-XXX
      return {
        chargerId: standardId,
        stationId: 'ST-DYN',
        stationName: 'PowerGrid Supercharger Hub',
        location: 'Tirupati East, Andhra Pradesh',
        connectorType: 'CCS2',
        powerKw: 120,
        ratePerKwh: 12,
        isAvailable: true,
      };
    }

    return null;
  }

  /**
   * Validate charger and return full payload or error
   */
  async validateCharger(chargerPayloadOrId: string | ChargerQRPayload): Promise<{
    success: boolean;
    data?: ChargerQRPayload;
    error?: string;
  }> {
    // Artificial mini latency for realistic scanner confirmation
    await new Promise((resolve) => setTimeout(resolve, 350));

    let payload: ChargerQRPayload | null = null;

    if (typeof chargerPayloadOrId === 'string') {
      payload = this.parseQRString(chargerPayloadOrId);
    } else {
      payload = chargerPayloadOrId;
    }

    if (!payload) {
      return {
        success: false,
        error: 'Invalid QR Code. Please scan an authentic VoltGrid / PowerGrid charger QR code.',
      };
    }

    if (payload.isAvailable === false) {
      return {
        success: false,
        error: payload.statusText || `Charger ${payload.chargerId} is currently unavailable or under maintenance.`,
      };
    }

    return {
      success: true,
      data: payload,
    };
  }

  /**
   * Get default fallback demo charger (CH-027)
   */
  getDefaultCharger(): ChargerQRPayload {
    return { ...KNOWN_CHARGERS_CATALOG['CH-027'] };
  }
}

export const qrScannerService = new QRScannerService();
