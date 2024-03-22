import {useRef, useEffect} from 'react';
import styled from '@emotion/styled';
import * as echarts from 'echarts';

const Layout = styled.div`
    width: 400px;
    height: 240px;
`;

interface Props {
    running: number;
    paused: number;
    crashed: number;
}

export default function TimeChart({running, paused, crashed}: Props) {
    const root = useRef<HTMLDivElement>(null);
    useEffect(
        () => {
            const container = root.current;

            if (!container) {
                return;
            }

            const chart = echarts.init(container);
            const total = running + paused + crashed;
            const percent = (value: number) => Math.floor(value / total * 100);
            const options = {
                grid: {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['50%', '70%'],
                        data: [
                            {
                                name: 'Running',
                                value: percent(running),
                                itemStyle: {color: '#46bb14'},
                            },
                            {
                                name: 'Paused',
                                value: percent(paused),
                                itemStyle: {color: '#ec9c39'},
                            },
                            {
                                name: 'Crashed',
                                value: percent(crashed),
                                itemStyle: {color: '#fc4f5f'},
                            },
                        ],
                    },
                ],
            };
            chart.setOption(options);

            return () => chart.dispose();
        },
        [crashed, paused, running]
    );

    return <Layout ref={root} />;
}
