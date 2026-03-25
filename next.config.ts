import type { NextConfig } from "next"

const isProd = process.env.NODE_ENV === "production"

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/lenny-product-fortune-teller" : "",
  assetPrefix: isProd ? "/lenny-product-fortune-teller/" : "",
  images: {
    unoptimized: true,
  },
}

export default nextConfig
