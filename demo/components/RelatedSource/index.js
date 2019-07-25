import SourceCode from '../SourceCode';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions
import userListSource from '../SourceCode/loader!../UserList/index.js';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions
import hostInfoSource from '../SourceCode/loader!../HostInfo/index.js';

const SOURCES = {
    UserList: userListSource,
    HostInfo: hostInfoSource,
};

export default ({match}) => {
    const source = SOURCES[match.params.filename];

    return <SourceCode toggle={false} source={source} />;
};
