/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  distDir: 'build',

  // Add Webpack and watch logging
  webpack(config, { dev }) {
    if (dev) {
      console.log('[DEBUG] Webpack config is running in development mode');

      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.watchRun.tap('WatchLoggerPlugin', (comp) => {
            console.log('[WATCH RUN] Detected file change triggering rebuild');
          });
        }
      });
    }
    return config;
  },

  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/.next/**', '**/node_modules/**', '**/build/**', '**/public/**'],
    };

    console.log('[DEBUG] webpackDevMiddleware watchOptions:', config.watchOptions);
    return config;
  }
};

export default nextConfig;
