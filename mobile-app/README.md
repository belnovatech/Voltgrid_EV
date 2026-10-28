# Voltgrid EV — Android Mobile Application

Production-grade, native-wrapped Android mobile application for the **Voltgrid EV** charging platform, built using React 18, TypeScript, Vite, and Capacitor 6.

---

## ⚡ Overview & Mission
This mobile application delivers an intelligent, electric-mobility driver experience designed specifically for mobile Android devices:
- **EV Drivers Only**: Strictly restricts access to regular electric vehicle drivers (no admin screens or operations dashboard clutter).
- **Official Brand Design**: Styled with the official circular badge brand palette:
  - Deep Navy: `#061B35` / `#071B32`
  - Neon Green: `#39E600`
  - Electric Cyan: `#00D4F2`
  - Surface: `#0D2948`
- **Mobile-First Navigation**: Fixed bottom navigation bar featuring 5 primary user tabs:
  1. **Home**: Driver greeting, live active charging card, quick actions, primary EV status, nearby stations.
  2. **Explore**: Search & filter charging hubs across AP/Telangana, real connector types (CCS2, Type 2), power ratings (60kW-150kW), charger bay statuses, and direct Google Maps directions.
  3. **Bookings**: Advanced charger bay reservations, interactive booking sheet, slot cancellations.
  4. **Activity**: Real-time interactive charging session monitor (battery SoC % gauge, kWh counter, duration timer, live billing) and wallet transaction history.
  5. **Profile**: Driver credentials, EV vehicle management (add, edit, set primary, delete), support tickets, and secure session logout.

---

## 🛠️ Architecture & Folder Structure

```
mobile-app/
├── android/                             # Native Android Studio / Gradle project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml      # Internet, network state & hardware back handling
│   │   │   ├── java/                    # MainActivity
│   │   │   └── res/                     # Official brand icons and dark splash screen
│   │   └── build/outputs/apk/debug/     # Output APK
│   ├── build.gradle
│   └── gradlew.bat
├── public/
│   └── assets/
│       └── voltgrid-ev-logo.png         # Official high-resolution brand badge
├── src/
│   ├── app/
│   │   ├── App.tsx                      # Root component with back button & status bar setup
│   │   ├── App.css
│   │   ├── routes.tsx                   # Mobile route definitions
│   │   └── ProtectedRoute.tsx           # Role-based customer authentication guard
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppButton.tsx / .css     # Neon green & cyan reactive mobile buttons
│   │   │   ├── LoadingState.tsx / .css  # Glowing neon pulse loading ring
│   │   │   └── ErrorState.tsx / .css    # Friendly error & retry state
│   │   └── layout/
│   │       ├── AppHeader.tsx / .css     # Brand header with notification badge & avatar
│   │       └── BottomNavigation.tsx / .css # Fixed bottom navigation with charging dot
│   ├── features/
│   │   ├── auth/                        # Mobile OTP & Password login (Driver only)
│   │   ├── dashboard/                   # Home dashboard screen
│   │   ├── stations/                    # Station search & bay details
│   │   ├── bookings/                    # Slot reservation management
│   │   ├── charging/                    # Live session monitor & wallet top-up
│   │   ├── notifications/               # Driver notifications
│   │   └── profile/                     # Profile, vehicle CRUD & support inquiries
│   ├── services/
│   │   ├── apiClient.ts                 # Centralized fetch client with retry & timeout
│   │   ├── apiConfig.ts                 # Base URL & demo fallback configuration
│   │   ├── authService.ts               # Driver session & token storage via Preferences
│   │   ├── chargingSessionService.ts    # Live charging physics & simulation loop
│   │   ├── customerService.ts           # Customer profile, vehicles & reservations
│   │   ├── stationService.ts            # EV stations directory & geo lookup
│   │   └── walletService.ts             # Authoritative wallet ledger
│   ├── theme/
│   │   ├── colors.css                   # Official color tokens
│   │   ├── typography.css               # Mobile typography scale
│   │   └── spacing.css                  # Radii and safe-area variables
│   ├── index.css
│   └── main.tsx
├── capacitor.config.ts                  # App ID: com.voltgrid.ev.mobile
├── package.json
└── tsconfig.json
```

---

## 🚀 Development & Build Commands

### 1. Run Web Preview Locally
```bash
npm install
npm run dev
```

### 2. Build Frontend & Sync to Android
```bash
npm run build
npx cap sync android
```

### 3. Build Android Debug APK
```bash
cd android
.\gradlew.bat assembleDebug
```

---

## 📱 APK Output Location
Standard Gradle build path:
`C:\Users\Manikantha.N\Desktop\Voltgrid_EV\mobile-app\android\app\build\outputs\apk\debug\app-debug.apk`

### Installing on Device / Emulator via ADB:
```bash
adb install -r "C:\Users\Manikantha.N\Desktop\Voltgrid_EV\mobile-app\android\app\build\outputs\apk\debug\app-debug.apk"
```
