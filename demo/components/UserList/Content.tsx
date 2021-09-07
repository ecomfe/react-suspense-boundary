import {useMemo} from 'react';
import styled from '@emotion/styled';
import {Table, Button, Space} from 'antd';
import {User} from '../../api/user';

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
        render(date: Date) {
            return date.toLocaleString();
        },
    },
];

const Header = styled.header`
    display: flex;
    flex-direction: row-reverse;
    margin: 20px;
`;

interface Props {
    controllable?: boolean;
    crashable?: boolean;
    defaultLoading?: boolean;
    dataSource: User[];
    pageIndex: number;
    totalCount: number;
    pageSize: number;
    onCrash: () => void;
    onExpire: () => void;
    onRefresh: () => void;
    onPageChange: (pageIndex: number) => void;
}

export function Content(props: Props) {
    const {
        controllable = false,
        crashable = false,
        defaultLoading = false,
        dataSource,
        pageIndex,
        totalCount,
        pageSize,
        onCrash,
        onExpire,
        onRefresh,
        onPageChange,
    } = props;
    const pagination = useMemo(
        () => {
            return {
                pageSize,
                total: totalCount,
                current: pageIndex,
                onChange: onPageChange,
            };
        },
        [onPageChange, pageIndex, pageSize, totalCount]
    );

    return (
        <>
            <Header>
                <Space>
                    {crashable && <Button onClick={onCrash}>Crash It</Button>}
                    <Button disabled={!controllable} onClick={onExpire}>
                        Expire Cache
                    </Button>
                    <Button disabled={!controllable} onClick={onRefresh}>
                        Refresh List
                    </Button>
                </Space>
            </Header>
            <Table
                rowKey="id"
                loading={defaultLoading}
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
            />
        </>
    );
}
