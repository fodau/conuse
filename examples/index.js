import React from 'react';
import ReactDOM from 'react-dom';
import createConuse from 'conuse';

// 1️⃣ Create a custom hook
function useCounter() {
  const [count, setCount] = React.useState(0);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

// 2️⃣ Wrap your hook with the createConuse factory
const { ConuseProvider, useConuseContext } = createConuse({
  counter: useCounter,
});

const Button = () => {
  // 3️⃣ Use context instead of custom hook
  const { increment } = useConuseContext('counter');
  return <button onClick={increment}>+</button>;
};

const Count = () => {
  // 4️⃣ Use context in other components
  const { count } = useConuseContext('counter');
  return <span>{count}</span>;
};

// 5️⃣ Wrap your components with Provider
const App = () => (
  <ConuseProvider>
    <Count />
    <Button />
  </ConuseProvider>
);
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
