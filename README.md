# VoltGrid — EV Charging Platform

VoltGrid is a modern EV charging platform for bikes, cars, and buses.

## ✨ Features

- **Pixel-Accurate UI**: Designed precisely after the VoltGrid reference design.
- **Full Flow**: Landing Page → Sign In with Mobile (+91) → 6-Digit OTP Verification → Authenticated Dashboard.
- **Separation of Concerns**: TSX and CSS are strictly kept separate.
- **Isolated Service Architecture**: Centralized `apiClient`, `authService`, and isolated `demoData` for easy backend integration.
- **Robust Phone & OTP Validation**: 10-digit Indian phone normalization & validation; 6-digit OTP handling with countdown timer and resend capability.
- **Responsive Layout**: Designed for mobile (320px+), tablet, and desktop viewports.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## ⚙️ Environment Variables
Refer to `.env.example`:
- `VITE_API_BASE_URL`: Base URL for VoltGrid API.
- `VITE_ENABLE_DEMO_MODE`: Set to `true` for client-side demo mode, `false` for live API backend.
- `VITE_DEMO_OTP`: Configurable demo OTP (default: `123456`).
- `VITE_OTP_RESEND_COOLDOWN_SECONDS`: Timer countdown in seconds (default: `29`).
