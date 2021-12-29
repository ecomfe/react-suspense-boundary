exports.build = {
    appTitle: 'React Suspense Boundary',
    uses: ['antd', 'emotion'],
    finalize: (webpackConfig, entry) => {
        if (entry.usage === 'build') {
            webpackConfig.output.publicPath = '/react-suspense-boundary/assets/';
        }

        return webpackConfig;
    },
};

exports.devServer = {
    port: 9010,
};
