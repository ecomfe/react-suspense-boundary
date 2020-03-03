import SourceCode from '../SourceCode';
import userListSource from '../SourceCode/loader!../UserList/index.js';
import hostInfoSource from '../SourceCode/loader!../HostInfo/index.js';
import progressSource from '../SourceCode/loader!../Progress/index.js';

const SOURCES = {
    UserList: userListSource,
    HostInfo: hostInfoSource,
    Progress: progressSource,
};

export default ({match}) => {
    const source = SOURCES[match.params.filename];

    return <SourceCode toggle={false} source={source} />;
};
