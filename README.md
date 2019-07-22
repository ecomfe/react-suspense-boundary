# react-suspense-boundary

A boundary component working with suspense and error

## Usage

### Basic

```jsx
import {Boundary, useResource} from 'react-suspense-boundary';

// Create or import an async function
const fetchInfo = ({id}) => fetch(`/info/${id}`).then(response => response.json());

// Implement your presentational component
const Info = ({id}) => {
    // Call `useResource` to fetch, note the return value is an array
    const [info] = useResource(fetchInfo, {id});

    // There is no `loading` branch, push returned object immediately to render
    return (
        <div>
            {info.id}: {info.name}
        </div>
    );
};

// Simply wrap your component in `Boundary`
export default () => (
    <Boundary>
        <Info />
    </Boundary>
);
```
