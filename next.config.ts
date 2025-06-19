// next.config.ts (Final Corrected Version for this specific error)

import withPWAInit from '@ducanh2912/next-pwa';

// Step 1: Initialize the PWA plugin
const withPWA = withPWAInit({
  dest: 'public',
  // The 'skipWaiting' and 'register' properties were causing issues.
  // The library often handles these well by default.
  // Let's rely on the defaults for now to get the build working.
  // If you need to force an update, you can add `skipWaiting: true` inside a `workboxOptions` key if needed later.
  disable: process.env.NODE_ENV === 'development',
});

// Step 2: Define your standard Next.js configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your other Next.js config options go here.
  reactStrictMode: true,
};

// Step 3: Export the wrapped config
export default withPWA(nextConfig);