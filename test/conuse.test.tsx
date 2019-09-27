import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import createConuse from '../src/index';

const useCounter = ({ initialCount = 0 } = {}) => {
  const [count, setCount] = React.useState(initialCount);
  const increment = () => setCount(count + 1);
  return { count, increment };
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
