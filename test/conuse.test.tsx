import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import createConuse from '../src/index';

const useCounter = ({ initialCount = 0 } = {}) => {
  const [count, setCount] = React.useState(initialCount);
  const increment = () => setCount(count + 1);
  return { count, increment };
};

const useToggle = (initialValue = false) => {
  const [state, setState] = React.useState(initialValue);
  return [state, () => setState(currentValue => !currentValue)];
};

test('#Basic', () => {
  const COUNTER = 'counter';
  const { ConuseProvider, useConuseContext } = createConuse({ [COUNTER]: useCounter });

  const Increment = () => {
    const { increment } = useConuseContext(COUNTER);
    return <button onClick={increment}>Increment</button>;
  };

  const Count = () => {
    const { count } = useConuseContext(COUNTER);
    return <div>{count}</div>;
  };

  const App = () => (
    <ConuseProvider>
      <Increment />
      <Count />
    </ConuseProvider>
  );

  const { getByText } = render(<App />);
  expect(getByText('0')).toBeDefined();

  fireEvent.click(getByText('Increment'));
  expect(getByText('1')).toBeDefined();
});

test('#Use all hook', () => {
  const { ConuseProvider, useConuseContext } = createConuse({ counter: useCounter });

  const Increment = () => {
    const { counter } = useConuseContext();
    const { increment } = counter();

    return <button onClick={increment}>Increment</button>;
  };

  const Count = () => {
    const { counter } = useConuseContext();
    const { count } = counter();
    return <div>{count}</div>;
  };

  const App = () => (
    <ConuseProvider>
      <Increment />
      <Count />
    </ConuseProvider>
  );

  const { getByText } = render(<App />);
  expect(getByText('0')).toBeDefined();

  fireEvent.click(getByText('Increment'));
  expect(getByText('1')).toBeDefined();
});

test('#Multiple Hooks', () => {
  const COUNTER = 'counter';
  const TOGGLE = 'toggle';
  const { ConuseProvider, useConuseContext } = createConuse({
    [COUNTER]: useCounter,
    [TOGGLE]: useToggle,
  });

  const Increment = () => {
    const { increment } = useConuseContext(COUNTER);
    return <button onClick={increment}>Increment</button>;
  };

  const Count = () => {
    const { count } = useConuseContext(COUNTER);
    return <div>{count}</div>;
  };

  const Toggle = () => {
    const [, toggle] = useConuseContext(TOGGLE);
    return <div onClick={toggle}>Toggle</div>;
  };

  const Value = () => {
    const [state] = useConuseContext(TOGGLE);
    return <div>{state.toString()}</div>;
  };

  const App = () => (
    <ConuseProvider>
      <Increment />
      <Count />

      <Toggle />
      <Value />
    </ConuseProvider>
  );

  const { getByText } = render(<App />);
  expect(getByText('0')).toBeDefined();
  expect(getByText('false')).toBeDefined();

  fireEvent.click(getByText('Increment'));
  expect(getByText('1')).toBeDefined();

  fireEvent.click(getByText('Toggle'));
  expect(getByText('true')).toBeDefined();

  fireEvent.click(getByText('Toggle'));
  expect(getByText('false')).toBeDefined();
});
