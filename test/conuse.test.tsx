import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
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
  const yieldLog: string[] = [];
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
    yieldLog.push(`Count-${count}`);
    return <div>{count}</div>;
  };

  const Toggle = () => {
    const [, toggle] = useConuseContext(TOGGLE);
    return <div onClick={toggle}>Toggle</div>;
  };

  const Value = () => {
    const [state] = useConuseContext(TOGGLE);
    yieldLog.push(`Toggle-${state}`);
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
  expect(yieldLog).toEqual(['Count-0', 'Toggle-false']);

  fireEvent.click(getByText('Increment'));
  expect(getByText('1')).toBeDefined();
  expect(yieldLog).toEqual(['Count-0', 'Toggle-false', 'Count-1']);

  fireEvent.click(getByText('Toggle'));
  expect(getByText('true')).toBeDefined();
  expect(yieldLog).toEqual(['Count-0', 'Toggle-false', 'Count-1', 'Toggle-true']);

  fireEvent.click(getByText('Toggle'));
  expect(getByText('false')).toBeDefined();
  expect(yieldLog).toEqual(['Count-0', 'Toggle-false', 'Count-1', 'Toggle-true', 'Toggle-false']);
});

test('#Compose Conuse', () => {
  const COUNTER = 'counter';
  const TOGGLE = 'toggle';

  const ToggleConuse = createConuse({ [TOGGLE]: useToggle });

  const { ConuseProvider, useConuseContext } = createConuse(
    {
      [COUNTER]: useCounter,
    },
    { [TOGGLE]: ToggleConuse }
  );

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

test('#GetStore', () => {
  const COUNTER = 'counter';
  const { ConuseProvider, useConuseContext, getContext } = createConuse({ [COUNTER]: useCounter });

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
  expect(getContext(COUNTER).count).toEqual(0);

  act(() => {
    getContext(COUNTER).increment();
  });

  expect(getByText('1')).toBeDefined();
  expect(getContext(COUNTER).count).toEqual(1);

  fireEvent.click(getByText('Increment'));
  expect(getByText('2')).toBeDefined();
  expect(getContext(COUNTER).count).toEqual(2);
});

test('#Value Props', () => {
  const COUNTER = 'counter';
  const { ConuseProvider, useConuseContext } = createConuse({ [COUNTER]: useCounter });

  const Increment = () => {
    const { increment } = useConuseContext(COUNTER);
    const { locale } = useConuseContext();

    return <button onClick={increment}>{locale.name}</button>;
  };

  const Count = () => {
    const { count } = useConuseContext(COUNTER);
    return <div>{count}</div>;
  };

  const App = () => (
    <ConuseProvider value={{ locale: { name: 'Increment' } }}>
      <Increment />
      <Count />
    </ConuseProvider>
  );

  const { getByText } = render(<App />);
  expect(getByText('0')).toBeDefined();

  expect(getByText('Increment')).toBeInTheDocument();
});
