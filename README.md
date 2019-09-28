# conuse

> Share `Hook` with `Context` 

```js
import React, { useState } from 'react';
import createConuse from 'conuse';

// 1️⃣ Create a custom hook
function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(prevCount => prevCount + 1);
  return { count, increment };
}

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