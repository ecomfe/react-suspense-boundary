/* eslint-disable import/unambiguous, import/no-commonjs, import/no-nodejs-modules */
// const {rules} = require('reskript');

exports.featureMatrix = {
    stable: {},
    dev: {},
};

exports.build = {
    appTitle: 'React Suspense Boundary',
};

exports.devServer = {
    port: 9010,
    hot: 'all',
};

exports.addition = ({usage}) => {
    if (usage === 'build') {
        return {
            output: {
                publicPath: '/react-suspense-boundary/assets/',
            },
        };
    }

    return {};
};
