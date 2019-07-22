import {render} from 'react-dom';
import UserList from '../components/UserList';

render(
    <UserList />,
    document.body.appendChild(document.createElement('div'))
);
