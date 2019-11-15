# conuse

> Share `Hook` with `Context`

[English](./README.md) | 简体中文

## 开始

```js
import React, { useState } from 'react';
import createConuse from 'conuse';

// 1️⃣ 创建一个自定义 Hook
const useCounter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(prevCount => prevCount + 1);
  return { count, increment };
};

// 2️⃣ 把自定义 Hook 传入 createConuse 作为参数
const { ConuseProvider, useConuseContext } = createConuse({ counter: useCounter });

function Button() {
  // 3️⃣ 使用 use Context 获取自定义 Hook 提供的方法和状态
  const { increment } = useConuseContext('counter');
  return <button onClick={increment}>+</button>;
}

function Count() {
  // 4️⃣ 同样，通过 use Context 获取自定义 Hook 提供的方法和状态
  const { count } = useConuseContext('counter');
  return <span>{count}</span>;
}

function App() {
  // 5️⃣ 用 Provider 包在你的组件外面
  return (
    <ConuseProvider>
      <Count />
      <Button />
    </ConuseProvider>
  );
}
```

## 安装

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

Conuse 会暴露 `createConuse` 函数，可以通过该函数创建出 `conuse` 类型，类型属性如下：

```
Conuse {
  ConuseProvider: React.FC<any>;
  useConuseContext: (name?: string) => any;
  getContext: (name?: string) => any;
}
```

#### useMap

类型: `{ [name: string]: Hook }`

这是一个自定义 Hook 对象，可以组件多个 Hook。如果你想获取某个 Hook，你可以把 name 传入到 `useConuseContext`，例子如下：

```js
const { useConuseContext } = createConuse({ counter: useCounter });
const Component = () => {
  // 拿到 useCounter 值
  const { count } = useConuseContext('counter');
  return count;
};
```

#### conuse

类型: `Conuse`

可以组件多个 Conuse

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

类型: `React.FC<any>`

使用方式跟 [Context.Provider](https://reactjs.org/docs/context.html#contextprovider) 一致, 可以把 `ConuseProvider` 放在你 App 组件的最外边。

```js
<ConuseProvider>
  <App />
</ConuseProvider>
```

#### useConuseContext

类型: `(name?: string) => any`

获取特定 Hook 的值

```js
const [value, setValue] = useConuseContext(<name>)
```

参数 `name` 必须是 `useMap` 里面某个 key，这样子你就可以获取到特定 Hook 值。如果你想要获取所有的 Hook 的话，你可以不传 name。

```js
const { useCounter } = useConuseContext();
const { count } = useCounter();
```

#### getContext

类型: `(name?: string) => any`

你可以通过 getContext 方式，在非 `Function Component` 里面就可以获取到 Hook 值

```js
const handleClick = () => {
  const { count } = getContext('counter');
};

const App = () => {
  return <Button onClick={handleClick}>点击</Button>;
};
```

## 灵感

必须要感谢 [constate](https://github.com/diegohaz/constate) 和 [unstated-next](https://github.com/jamiebuilds/unstated-next) 精彩的想法,还有 @kentcdodds 的[Application State Management with React](https://kentcdodds.com/blog/application-state-management-with-react/).
