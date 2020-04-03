# react-suspense-boundary

A boundary component working with suspense and error

## Install

```shell
npm install react-suspense-boundary
```

## Demo

See online demo here: [https://ecomfe.github.io/react-suspense-boundary/](https://ecomfe.github.io/react-suspense-boundary/)

You can start demo app yourself by executing:

```shell
npm start
```

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

### Boundary

`Boundary` components by its name defines a boundary in your view, within a boundary all async resource fetchings and errors are collected to form a loading or error indicator.

A `Boundary` component receives props below:

```typescript
interface BoundaryProps {
    // Defines how resource responses are cached in context, either per resource function or per invocation params
    cacheMode: 'function' | 'key';
    // When any of async progress is pending, boundary will render this element
    pendingFallback: Node;
    // When any error are received, will render this function
    renderError(error: Error): Node;
    // When any error are catched, will call this function
    onErrorCaught(error: Error, info: ErrorInfo): void;
}
```

### useResource

The `useResource` hook is used to inspect an async function within a boundary:

```typescript
type Resource<T> = [
    T,
    {
        expire(): void;
        refresh(): void;
    }
];

type useResource<TIn, TOut> = (action: (input: TIn) => TOut, params: TIn): Resource<T>;
```

Unlike other async hooks, `useResource` returns the result "immediately", there is no `pending` or `loading` state, no exception will throw.

Other than the result itself, the second object of `useResource`'s returned array is a a bunch of functions to manually control the cache:

- `expire` will immediately remove the cached result, causing the upper `Boundary` to be pending until `action` is resolved the next time.
- `refresh` is a function to run `action` again without removing previously cached result.

### withBoundary

To wrap a single component with `Boundary`, unlike directly create `<Boundary>` element, this HOC has 2 different options:

- `pendingFallback` can be a function which receives props from wrapped component.
- `is` has a default value of `Fragment` since a single component doesn't require an extra wrap element.

```javascript
import {withBoundary, useResource} from 'react-suspense-boundary';

const Foo = props => {
    const [value] = useResource(fetchValue, props.name);
    return <span>value is: ${value}</span>;
};

const boundary = {
    createPendingFallback(props) {
        return <span>loading {props.name}</span>;
    }
};

export default withBoundary(boundary)(Foo);
