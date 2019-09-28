# conuse

> Share `Hook` with `Context`

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

### `createConuse(useValue[, conuse])`

Conuse exports a single factory method called `createConuse` which return `conuse` type, like that:

```sh
Conuse {
  ConuseProvider: React.FC<any>;
  useConuseContext: (name?: string) => any;
  getContext: (name?: string) => any;
}
```

#### useValue

Type: `{ [name: string]: hook }`

It receives custom hook map, use it to compose multiple hook. You can access one hook by pass name to `useConuseContext` parameter.

```js
const { ConuseProvider, useConuseContext } = createConuse({ counter: useCounter });
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
const { ConuseProvider, useConuseContext } = createConuse(
  { counter: useCounter },
  { toggle: toggleConuse }
);
const Component = () => {
  const { count } = useConuseContext('counter');
  const { toggle } = useConuseContext('toggle');
  return `${count}${toggle}`;
};
```
