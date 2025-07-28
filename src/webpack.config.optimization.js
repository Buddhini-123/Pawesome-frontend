// webpack.config.optimization.js
// This configuration should be merged with your existing webpack config
// If using Create React App, you'll need to eject or use CRACO/react-app-rewired

module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10,
          reuseExistingChunk: true,
        },
        
        // React core libraries
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react-vendor',
          priority: 20,
        },
        
        // UI libraries (heavy)
        ui: {
          test: /[\\/]node_modules[\\/](framer-motion|lucide-react|react-icons)[\\/]/,
          name: 'ui-vendor',
          priority: 15,
        },
        
        // 3D libraries (very heavy - separate bundle)
        three: {
          test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
          name: 'three-vendor',
          priority: 25,
        },
        
        // Animation libraries
        animation: {
          test: /[\\/]node_modules[\\/](gsap|lottie-react)[\\/]/,
          name: 'animation-vendor',
          priority: 15,
        },
        
        // Common components shared across routes
        common: {
          test: /[\\/]src[\\/]components[\\/]common[\\/]/,
          name: 'common',
          priority: 5,
          minChunks: 2,
        },
        
        // Admin bundle - all admin code in one chunk
        admin: {
          test: /[\\/]src[\\/]components[\\/]admin[\\/]/,
          name: 'admin',
          priority: 8,
          enforce: true,
        },
        
        // Features bundle - heavy feature pages
        features: {
          test: /[\\/]src[\\/]components[\\/]pages[\\/]Features[\\/]/,
          name: 'features',
          priority: 7,
        },
        
        // Shop bundle - e-commerce related
        shop: {
          test: /[\\/]src[\\/]components[\\/]pages[\\/]Shop[\\/]/,
          name: 'shop',
          priority: 6,
        },
        
        // Default chunk for remaining code
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    
    // Runtime chunk for webpack runtime
    runtimeChunk: 'single',
    
    // Module IDs for long-term caching
    moduleIds: 'deterministic',
    
    // Minimize in production
    minimize: process.env.NODE_ENV === 'production',
    
    // Tree shaking
    usedExports: true,
    
    // Side effects optimization
    sideEffects: false,
  },
  
  // Performance hints
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000, // 500kb
    maxAssetSize: 512000, // 500kb
    assetFilter: function(assetFilename) {
      // Only check js/css files
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
    },
  },
};