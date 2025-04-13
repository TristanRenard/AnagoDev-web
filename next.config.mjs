/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mdxeditor/editor"],
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true }

    return config
  },
  i18n: {
    locales: ["en", "fr", "es", "de", "it", "ar"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.stripe.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "anagodev.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse4.mm.bing.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse3.mm.bing.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse2.mm.bing.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse1.explicit.bing.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse1.mm.bing.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse1.explicit.bing.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse1.explicit.bing.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse1.explicit.bing.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse1.explicit.bing.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse1.explicit.bing.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tse1.explicit.bing.net",
        port: "",
      }
    ],
  },
  output: "standalone",
}

export default nextConfig
