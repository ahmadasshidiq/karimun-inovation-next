import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan akses dev server dari perangkat lain dalam jaringan lokal.
  allowedDevOrigins: ["192.168.18.27"],
};

export default nextConfig;
