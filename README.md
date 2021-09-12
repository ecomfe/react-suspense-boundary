# react-suspense-boundary

A boundary component working with suspense and error

Version 2.x is an experimental implement using [use-subscription](https://www.npmjs.com/package/use-subscription) to simulate future official suspense data fetching.

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
interface RenderErrorOptions {
    recover: () => void;
}

interface BoundaryProps {
    // When any of async progress is pending, boundary will render this element
    pendingFallback: ReactNode;
    // When any error are received, will render this function
    renderError(error: Error, options: RenderErrorOptions): ReactNode;
    // When any error are catched, will call this function
    onErrorCaught(error: Error, info: ErrorInfo): void;
}
```

### useResource

The `useResource` hook is used to inspect an async function within a boundary:

```ts
type Resource<T> = [
    T,
    {
        expire(): void;
        refresh(): void;
    }
];

function useResource<I, O>(action: (input: I) => Promise<O>, params: I): Resource<O>;
function useConstantResource<O>(action: () => Promise<O>): Resource<O>;
```

Unlike other async hooks, `useResource` returns the result "immediately", there is no `pending` or `loading` state, no exception will throw.

Other than the result itself, the second object of `useResource`'s returned array is a a bunch of functions to manually control the cache:

- `expire` will immediately remove the cached result, causing the upper `Boundary` to be pending until `action` is resolved the next time.
- `refresh` is a function to run `action` again without removing previously cached result.

### Default configuration

`BoundaryConfigProvider` provides default configurations to `pendingFallback`, `renderError` and `onErrorCaught` props.

```javascript
import {Spin} from 'antd';
import {BoundaryConfigProvider} from 'react-suspense-boundary';

const defaultPendingFallback = <Spin />;

const defaultRenderError = error => (
    <div>
        {error.message}
    </div>
);

const App = () => {
    <BoundaryConfigProvider
        pendingFallback={defaultPendingFallback}
        renderError={defaultRenderError}
    >
        {/* All Boundary elements inside it receives default configurations */}
    </BoundaryConfigProvider>
}
```

### Preload

Preload is much like resource fetching, they can be "immediately" fired within a render function:

```ts
function usePreloadResource<I, O>(action: (input: I) => Promise<O>, params: I): void;
function usePreloadConstantResource<O>(action: () => Promise<O>): void;
```

Preload fires resource fetching process but not abort current render.

You can also get a `preload` function using `usePreloadCallback` hook to preload any resources in effect or event handlers:

```tsx
const preload = usePreloadCallback();

<Button onMouseEnter={() => preload(fetchList, {pageIndex: currentPageIndex + 1})}>
    Next Page
</Button>
```
