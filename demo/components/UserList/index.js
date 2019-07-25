import {useState, useMemo, useReducer} from 'react';
import {Table, Button} from 'antd';
import {useResource, useSnapshot} from '../../../src';
import {users} from '../../api';
import c from './index.less';

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

const UserList = ({skeleton, controllable, crashable}) => {
    const [pageIndex, setPageIndex] = useState(1);
    const [requestCrash, fallCrash] = useReducer(v => !v, false);
    useResource(requestCrash ? users.mustCrash : null);
    const [list, {expire, refresh}] = useResource(skeleton ? DEFAULT_LIST : users.list, {pageIndex});
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
        <>
            <header className={c.header}>
                {crashable && <Button className={c.action} onClick={fallCrash}>Crash It</Button>}
                <Button className={c.action} disabled={!controllable} onClick={expire}>Expire Cache</Button>
                <Button className={c.action} disabled={!controllable} onClick={refresh}>Refresh List</Button>
            </header>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={results}
                pagination={pagination}
                loading={skeleton}
            />
        </>
    );
};

UserList.defaultProps = {
    skeleton: false,
    controllable: false,
    crashable: false,
};

export default UserList;

