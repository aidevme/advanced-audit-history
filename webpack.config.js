const path = require('path');
const { getWebpackConfig } = require('pcf-scripts/webpackConfig');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function (env) {
    // Get the default PCF webpack config
    const config = getWebpackConfig(env);

    // Determine if this is a production build
    const isProduction = process.env.NODE_ENV === 'production' || env === 'production';

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

    // Set mode
    config.mode = isProduction ? 'production' : 'development';

    // Optimization settings with TerserPlugin for aggressive minification
    config.optimization = {
        ...config.optimization,
        minimize: true,
        usedExports: true,
        sideEffects: false,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true, // Remove console.log statements
                        drop_debugger: true, // Remove debugger statements
                        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
                        passes: 2, // Run compression twice for better results
                        unsafe_arrows: true, // Convert arrow functions to regular functions when smaller
                        unsafe_methods: true, // Optimize method calls
                        unsafe_proto: true, // Optimize prototype access
                        dead_code: true, // Remove unreachable code
                        conditionals: true, // Optimize if-s and conditional expressions
                        evaluate: true, // Evaluate constant expressions
                        booleans: true, // Optimize boolean expressions
                        loops: true, // Optimize loops when possible
                        unused: true, // Drop unreferenced variables and functions
                        toplevel: true, // Drop unreferenced top-level functions and variables
                        inline: 2, // Inline functions when beneficial
                        reduce_vars: true, // Improve optimization on variables assigned with constant values
                        side_effects: true, // Remove expressions which have no side effects
                    },
                    mangle: {
                        toplevel: true, // Mangle top-level names
                        properties: false, // Don't mangle properties (can break code)
                        safari10: true, // Work around Safari 10 bug
                    },
                    format: {
                        comments: false, // Remove all comments
                        ascii_only: true, // Escape Unicode characters in strings and regexps
                    },
                    keep_classnames: false, // Don't keep class names (smaller bundle)
                    keep_fnames: false, // Don't keep function names (smaller bundle)
                },
                extractComments: false, // Don't extract comments to separate file
                parallel: true, // Enable multi-process parallel running
            }),
        ],
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 20000, // Only create chunks larger than 20KB
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

    // Enable module concatenation (scope hoisting) for smaller bundles
    config.optimization.concatenateModules = true;

    // Resolve optimizations
    config.resolve = {
        ...config.resolve,
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        // Add aliases to reduce path resolution time
        alias: {
            ...config.resolve?.alias,
            'react': path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        },
        // Reduce the number of items to check when resolving modules
        modules: ['node_modules'],
    };

    // Module optimizations
    config.module = {
        ...config.module,
        // noParse for libraries that don't need parsing
        noParse: /\.min\.js$/,
    };

    return config;
};
