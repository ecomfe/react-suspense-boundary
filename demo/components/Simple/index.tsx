import {Boundary} from 'react-suspense-boundary';
import UserList from '../UserList';
import Loading from '../Loading';
// import SourceCode from '../SourceCode';
// TODO: 这里拿到的已经是babel处理过的了，要想别的办法
// import source from './index.tsx?source';

export default function Simple() {
    return (
        <Boundary pendingFallback={<Loading />}>
            <UserList />
            {/* <SourceCode source={source} /> */}
        </Boundary>
    );
}
