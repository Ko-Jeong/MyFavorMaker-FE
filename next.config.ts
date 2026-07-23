import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // 상위 폴더의 다른 lockfile 때문에 워크스페이스 루트가 잘못 잡히는 것을 방지
    root: import.meta.dirname,
  },
  allowedDevOrigins: ["192.168.45.147"],
};

export default nextConfig;
