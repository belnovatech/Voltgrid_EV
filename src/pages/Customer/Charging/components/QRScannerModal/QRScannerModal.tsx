import React, { useState, useEffect, useRef } from 'react';
import { qrScannerService, KNOWN_CHARGERS_CATALOG } from '../../../../../services/qrScannerService';
import { ChargerQRPayload } from '../../../../../types/charging';
import { CustomerReservation } from '../../../../../types/customer';
import './QRScannerModal.css';

interface QRScannerModalProps {
  isOpen: boolean;
  reservation?: CustomerReservation | null;
  onClose: () => void;
  onChargerDetected: (charger: ChargerQRPayload) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  reservation,
  onClose,
  onChargerDetected,
}) => {
  const [manualCode, setManualCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    setErrorMessage(null);
    setManualCode('');

    // Attempt to open camera if mediaDevices API is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setHasCameraPermission(true);
        })
        .catch(() => {
          // Camera not allowed or not available (e.g. in some browser sandbox)
          setHasCameraPermission(false);
        });
    } else {
      setHasCameraPermission(false);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  if (!isOpen) return null;

  const handleValidateCode = async (rawCode: string) => {
    setIsValidating(true);
    setErrorMessage(null);

    const result = await qrScannerService.validateCharger(rawCode);
    setIsValidating(false);

    if (result.success && result.data) {
      stopCamera();
      onChargerDetected(result.data);
    } else {
      setErrorMessage(result.error || 'Failed to detect valid charger QR code.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleValidateCode(manualCode.trim());
    }
  };

  return (
    <div className="voltgrid-qr-scanner-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="voltgrid-qr-scanner-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="voltgrid-qr-scanner-header">
          <div className="voltgrid-qr-scanner-header__titles">
            <h2 className="voltgrid-qr-scanner-header__title">Scan Charger QR Code</h2>
            <p className="voltgrid-qr-scanner-header__subtitle">
              Scan the QR code displayed on the charger to start your session.
            </p>
          </div>
          <button
            type="button"
            className="voltgrid-qr-scanner-header__close"
            onClick={onClose}
            aria-label="Close scanner"
          >
            ✕
          </button>
        </div>

        {/* Viewport Area */}
        <div className="voltgrid-qr-scanner-stage">
          <div className="voltgrid-qr-scanner-viewport">
            {hasCameraPermission && (
              <video
                ref={videoRef}
                className="voltgrid-qr-scanner-video"
                playsInline
                muted
                autoPlay
              />
            )}

            {!hasCameraPermission && (
              <div className="voltgrid-qr-scanner-fallback">
                <svg
                  className="voltgrid-qr-scanner-fallback__icon"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <span className="voltgrid-qr-scanner-fallback__text">
                  Camera ready · Point scanner at QR code or use quick presets below
                </span>
              </div>
            )}

            {/* Reticle Target Frame */}
            <div className="voltgrid-qr-scanner-corners">
              <div className="voltgrid-qr-corner voltgrid-qr-corner--tl" />
              <div className="voltgrid-qr-corner voltgrid-qr-corner--tr" />
              <div className="voltgrid-qr-corner voltgrid-qr-corner--bl" />
              <div className="voltgrid-qr-corner voltgrid-qr-corner--br" />
            </div>

            {/* Laser scanning beam */}
            <div className="voltgrid-qr-scanner-laser" />
          </div>

          <div className="voltgrid-qr-scanner-instruction">
            <span className="voltgrid-qr-scanner-instruction__dot" />
            <span>Position the QR code inside the frame</span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="voltgrid-qr-scanner-error" role="alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Scan Simulation Presets */}
          <div className="voltgrid-qr-scanner-presets">
            <h4 className="voltgrid-qr-scanner-presets__title">Quick Scan Presets</h4>
            <div className="voltgrid-qr-scanner-presets__list">
              {reservation?.chargerId && (
                <button
                  type="button"
                  className="voltgrid-qr-scanner-preset-btn"
                  onClick={() => handleValidateCode(reservation.chargerId || 'CH-027')}
                  disabled={isValidating}
                >
                  <div className="voltgrid-qr-scanner-preset-btn__left">
                    <span className="voltgrid-qr-scanner-preset-btn__id">
                      ⚡ Scan Reserved: {reservation.chargerId}
                    </span>
                    <span className="voltgrid-qr-scanner-preset-btn__meta">
                      {reservation.stationName} • {reservation.powerKw || 120} kW
                    </span>
                  </div>
                  <span className="voltgrid-qr-scanner-preset-btn__badge">Match Slot</span>
                </button>
              )}

              <button
                type="button"
                className="voltgrid-qr-scanner-preset-btn"
                onClick={() => handleValidateCode('CH-027')}
                disabled={isValidating}
              >
                <div className="voltgrid-qr-scanner-preset-btn__left">
                  <span className="voltgrid-qr-scanner-preset-btn__id">⚡ Scan CH-027</span>
                  <span className="voltgrid-qr-scanner-preset-btn__meta">
                    {KNOWN_CHARGERS_CATALOG['CH-027'].stationName} • 120 kW CCS2
                  </span>
                </div>
                <span className="voltgrid-qr-scanner-preset-btn__badge">120 kW</span>
              </button>

              <button
                type="button"
                className="voltgrid-qr-scanner-preset-btn"
                onClick={() => handleValidateCode('CH-015')}
                disabled={isValidating}
              >
                <div className="voltgrid-qr-scanner-preset-btn__left">
                  <span className="voltgrid-qr-scanner-preset-btn__id">⚡ Scan CH-015</span>
                  <span className="voltgrid-qr-scanner-preset-btn__meta">
                    {KNOWN_CHARGERS_CATALOG['CH-015'].stationName} • 120 kW CCS2
                  </span>
                </div>
                <span className="voltgrid-qr-scanner-preset-btn__badge">120 kW</span>
              </button>
            </div>
          </div>

          {/* Manual Input Fallback */}
          <form className="voltgrid-qr-scanner-manual" onSubmit={handleManualSubmit}>
            <input
              type="text"
              className="voltgrid-qr-scanner-manual__input"
              placeholder="Or enter charger code (e.g. CH-027)"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
            <button
              type="submit"
              className="voltgrid-qr-scanner-manual__btn"
              disabled={!manualCode.trim() || isValidating}
            >
              {isValidating ? 'Validating...' : 'Identify'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="voltgrid-qr-scanner-footer">
          <button type="button" className="voltgrid-qr-scanner-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
