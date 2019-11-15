# conuse

> Share `Hook` with `Context`

English | [简体中文](./README-zh.md)

## Get Started

```js
import React, { useState } from 'react';
import createConuse from 'conuse';

// 1️⃣ Create a custom hook
const useCounter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(prevCount => prevCount + 1);
  return { count, increment };
};

// 2️⃣ Wrap your hook with the createConuse factory
const { ConuseProvider, useConuseContext } = createConuse({ counter: useCounter });

function Button() {
  // 3️⃣ Use context instead of custom hook
  const { increment } = useConuseContext('counter');
  return <button onClick={increment}>+</button>;
}

function Count() {
  // 4️⃣ Use context in other components
  const { count } = useConuseContext('counter');
  return <span>{count}</span>;
}

function App() {
  // 5️⃣ Wrap your components with Provider
  return (
    <ConuseProvider>
      <Count />
      <Button />
    </ConuseProvider>
  );
}
```

## Installation

npm:

```sh
npm i conuse
```

Yarn:

```sh
yarn add conuse
```

## API

### `const { ConuseProvider, useConuseContext, getContext } = createConuse(useMap[, conuse])`

Conuse library exports a single factory method called `createConuse` which return `conuse` type, as follow:

```
Conuse {
  ConuseProvider: React.FC<any>;
  useConuseContext: (name?: string) => any;
  getContext: (name?: string) => any;
}
```

#### useMap

Type: `{ [name: string]: hook }`

It receives custom hook map, using it to compose multiple hook. You can get one hook by passing name to `useConuseContext` parameter.

```js
const { useConuseContext } = createConuse({ counter: useCounter });
const Component = () => {
  const { count } = useConuseContext('counter');
  return count;
};
```

#### conuse

Type: `Conuse`

Using it to compose multiple conuse.

```js
const toggleConuse = createConuse({ toggle: useToggle });
const { useConuseContext } = createConuse({ counter: useCounter }, { toggle: toggleConuse });
const Component = () => {
  const { count } = useConuseContext('counter');
  const { toggle } = useConuseContext('toggle');
  return `${count}${toggle}`;
};
```

#### ConuseProvider

Type: `React.FC<any>`

Just like [Context.Provider](https://reactjs.org/docs/context.html#contextprovider), to put the `ConuseProvider` at the top of your App.

```js
<ConuseProvider>
  <App />
</ConuseProvider>
```

#### useConuseContext

Type: `(name?: string) => any`

The children of ConuseProvider can get certain hook by useConuseContext.

```js
const [value, setValue] = useConuseContext(<name>)
```

The `name` parameter must be one of the keys of useMap, and you can get the returned of relevant hook which will be executed.

If you want to get all hooks, not passing name to useConuseContext. But the return of `useConuseContext()` is all hooks, not the
returned of all hooks, you need to execute hook function to get `state` and `setState`.

#### getContext

Type: `(name?: string) => any`

The difference between getContext and useConuseContext is `getContext` can be used everywhere, not only in Function Component.

## Inpiration

Thanks to [constate](https://github.com/diegohaz/constate) and [unstated-next](https://github.com/jamiebuilds/unstated-next) incredible work, and learned a lot from @kentcdodds' [Application State Management with React](https://kentcdodds.com/blog/application-state-management-with-react/).
