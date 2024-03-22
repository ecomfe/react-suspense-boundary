import {useState, useReducer} from 'react';
import {useResource, useConstantResource} from 'react-suspense-boundary';
import api from '../../api/user.js';
import {Content} from './Content.js';

const noCrash = () => {
    // eslint-disable-next-line no-console
    console.log('no crash');
    return Promise.resolve();
};

const noop = () => {};

interface Props {
    controllable?: boolean;
    crashable?: boolean;
}

function UserList({controllable, crashable}: Props) {
    const [pageIndex, setPageIndex] = useState(1);
    const [requestCrash, fallCrash] = useReducer(v => !v, false);
    useConstantResource(requestCrash ? api.mustCrash : noCrash);
    const [list, {pending, expire, refresh}] = useResource(api.list, {pageIndex});

    return (
        <Content
            crashable={crashable}
            controllable={controllable}
            refreshLoading={pending}
            dataSource={list.results}
            pageIndex={list.pageIndex}
            pageSize={list.pageSize}
            totalCount={list.total}
            onCrash={fallCrash}
            onExpire={expire}
            onRefresh={refresh}
            onPageChange={setPageIndex}
        />
    );
}

const SKELETON_CONTENT_PROPS = {
    dataSource: [],
    pageIndex: 1,
    totalCount: 10,
    pageSize: 10,
    loading: true,
    onCrash: noop,
    onExpire: noop,
    onRefresh: noop,
    onPageChange: noop,
};

UserList.Skeleton = function SkeletonUserList() {
    return <Content {...SKELETON_CONTENT_PROPS} />;
};

export default UserList;
