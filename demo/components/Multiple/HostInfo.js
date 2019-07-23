import {useRef, useEffect, useCallback} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import {Tag} from 'antd';
import {useResource} from '../../../src';
import {hosts} from '../../api';
import c from './HostInfo.less';

const Row = ({title, children}) => (
    <div className={c.row}>
        <span className={c.rowTitle}>
            {title}
        </span>
        <span className={c.rowValue}>
            {children}
        </span>
    </div>
);

const TimeChart = ({running, paused, crashed}) => {
    const root = useRef(null);
    useEffect(
        () => {
            const container = root.current;

            if (!container) {
                return;
            }

            const chart = echarts.init(container);
            const total = running + paused + crashed;
            const percent = value => Math.floor(value / total * 100);
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

            // eslint-disable-next-line consistent-return
            return () => chart.dispose();
        },
        [crashed, paused, running]
    );

    return <div className={c.chart} ref={root} />;
};

const HostTag = ({id, name, selected, onSelect}) => {
    const check = useCallback(
        () => {
            if (id !== selected) {
                onSelect(id);
            }
        },
        [id, onSelect, selected]
    );

    return <Tag.CheckableTag className={c.tag} checked={id === selected} onChange={check}>{name}</Tag.CheckableTag>;
};

const HostSelect = ({selected, all, onSelect}) => (
    <div className={c.hostSelect}>
        {all.map(i => <HostTag key={i.id} id={i.id} name={i.name} selected={selected} onSelect={onSelect} />)}
    </div>
);

const Content = ({className, id, all, onSelect}) => {
    const [{name, times, createdAt}] = useResource(hosts.find, {id});

    return (
        <div className={c('root', className)}>
            <div className={c.info}>
                <Row title="ID">{id}</Row>
                <Row title="Name">{name}</Row>
                <Row title="Created">{createdAt.toLocaleString()}</Row>
                <HostSelect all={all} selected={id} onSelect={onSelect} />
            </div>
            <TimeChart {...times} />
        </div>
    );
};


export default ({selected, onHostChange, ...props}) => {
    const [all] = useResource(hosts.list, {});
    const id = selected || all[0].id;

    return <Content id={id} all={all} onSelect={onHostChange} {...props} />;
};
