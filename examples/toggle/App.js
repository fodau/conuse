import React from 'react';
import createConuse from 'conuse';

const useCounter = () => {
  const [count, setCount] = React.useState(0);
  const increment = () => setCount(count + 1);
  return { count, increment };
};

const useToggle = (initialValue = false) => {
  const [state, setState] = React.useState(initialValue);
  return [state, () => setState(currentValue => !currentValue)];
};

const { ConuseProvider, useConuseContext } = createConuse({
  counter: useCounter,
  toggle: useToggle,
});

const Button = () => {
  const { increment } = useConuseContext('counter');
  const [state] = useConuseContext('toggle');
  const disabled = state ? '' : 'disabled';

  return (
    <button disabled={disabled} onClick={increment}>
      +
    </button>
  );
};

const Count = () => {
  const { count } = useConuseContext('counter');
  return <span>{count}</span>;
};

const Toggler = () => {
  const [state, toggle] = useConuseContext('toggle');
  return <button onClick={toggle}>{state ? 'Close' : 'Open'}</button>;
};

const App = () => (
  <ConuseProvider>
    <Count />
    <Button />
    <Toggler />
  </ConuseProvider>
);

export default App;
