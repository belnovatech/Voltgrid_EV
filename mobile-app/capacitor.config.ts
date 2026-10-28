import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.voltgrid.ev.mobile',
  appName: 'Voltgrid EV',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#071B32',
    },
    Keyboard: {
      resize: 'body',
    },
  },
};

export default config;
