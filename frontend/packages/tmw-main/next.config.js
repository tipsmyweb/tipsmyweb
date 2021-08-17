const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['tmw-common']);

module.exports = withPlugins([withTM, withImages], {
    webpack: config => {
        const rules = config.module.rules
            .find(rule => typeof rule.oneOf === 'object')
            .oneOf.filter(rule => Array.isArray(rule.use));

        rules.forEach(rule => {
            rule.use.forEach(moduleLoader => {
                if (
                    moduleLoader.loader.includes('css-loader') &&
                    typeof moduleLoader.options.modules === 'object'
                ) {
                    moduleLoader.options = {
                        ...moduleLoader.options,
                        modules: {
                            ...moduleLoader.options.modules,
                            exportLocalsConvention: 'camelCase', // https://github.com/webpack-contrib/css-loader#exportlocalsconvention
                        },
                    };
                }
            });
        });

        return config;
    },
});
