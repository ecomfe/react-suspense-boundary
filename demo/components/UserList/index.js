import {useState, useMemo} from 'react';
import {Table} from 'antd';
import {Boundary, useResource, useSnapshot} from '../../../src';
import {users} from '../../api';

const DEFAULT_LIST = {
    total: 0,
    pageSize: 1,
    results: [],
};

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Last Sign In',
        dataIndex: 'lastSignedIn',
        render(date) {
            return date.toLocaleString();
        },
    },
];

const List = ({skeleton}) => {
    const [pageIndex, setPageIndex] = useState(1);
    const [list] = useResource(skeleton ? DEFAULT_LIST : users.list, {pageIndex});
    const {total, pageSize, results} = useSnapshot(list.results.length ? list : null, list);
    const pagination = useMemo(
        () => {
            return {
                pageSize,
                total,
                current: pageIndex,
                onChange(page) {
                    setPageIndex(page);
                },
            };
        },
        [pageIndex, pageSize, total]
    );

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={results}
            pagination={pagination}
            loading={skeleton}
        />
    );
};

List.defaultProps = {
    skeleton: false,
};

export default () => (
    <Boundary cacheMode="function" pendingFallback={<List skeleton />}>
        <List />
    </Boundary>
);
