exports.featureMatrix = {
    stable: {},
    dev: {},
};

exports.build = {
    appTitle: 'React Suspense Boundary',
    extractCSS: false,
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
