import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Helps catch potential issues
 // swcMinify: true, // Enables faster builds with SWC
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ];
  },
  async headers() {
    console.log('Current Environment:', process.env.NODE_ENV);
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/:all*',
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
              },
            ],
          },
        ]
      : [
          {
            source: '/:all*(js|css|jpg|jpeg|png|gif|svg|woff2|woff|ttf|eot)',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public, max-age=31536000, immutable',
              },
            ],
          },
          {
            source: '/:all*(html|json)',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public, max-age=3600',
              },
            ],
          },
          {
            source: '/video/:path*',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public, max-age=31536000, immutable',
              },
            ],
          },
        ];
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Enable modern JavaScript delivery
      config.output.crossOriginLoading = 'anonymous';

      // Ensure webpack handles module/nomodule split
      if (config.optimization.splitChunks) {
        config.optimization.splitChunks.chunks = 'all';
        config.optimization.splitChunks.automaticNameDelimiter = '-';
        config.optimization.splitChunks.cacheGroups = {
            ...config.optimization.splitChunks.cacheGroups,
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
        };
      }


      // Add modern JavaScript handling
      config.module.rules.push({
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: '> 0.25%, not dead', // Modern browsers
                  useBuiltIns: 'entry',
                  corejs: 3,
                },
              ],
            ],
          },
        },
      });
    }

    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);