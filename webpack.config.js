const path = require('path');
const { getWebpackConfig } = require('pcf-scripts/webpackConfig');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function (env) {
    // Get the default PCF webpack config
    const config = getWebpackConfig(env);

    // Add bundle analyzer plugin if ANALYZE is set
    if (process.env.ANALYZE) {
        config.plugins = config.plugins || [];
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'bundle-report.html',
                openAnalyzer: true
            })
        );
    }

    // Optimization settings
    config.optimization = {
        ...config.optimization,
        minimize: true,
        usedExports: true,
        sideEffects: false,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                    reuseExistingChunk: true,
                },
                fluentui: {
                    test: /[\\/]node_modules[\\/]@fluentui[\\/]/,
                    name: 'fluentui',
                    priority: 20,
                    reuseExistingChunk: true,
                },
                icons: {
                    test: /[\\/]node_modules[\\/]@fluentui[\\/]react-icons[\\/]/,
                    name: 'icons',
                    priority: 30,
                    reuseExistingChunk: true,
                }
            }
        }
    };

    // Performance hints
    config.performance = {
        hints: 'warning',
        maxEntrypointSize: 5000000, // 5MB
        maxAssetSize: 5000000 // 5MB
    };

    return config;
};
