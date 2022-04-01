import {configure} from '@reskript/settings';

export default configure(
    'vite',
    {
        build: {
            appTitle: 'React Suspense Boundary',
            uses: ['antd', 'emotion'],
            finalize: (viteConfig, entry) => {
                if (entry.usage === 'build') {
                    viteConfig.base = '/react-suspense-boundary';
                }

                return viteConfig;
            },
        },
        devServer: {
            port: 9010,
        },
    }
);
