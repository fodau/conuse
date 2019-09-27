/**
 * Inspired by
 * * https://github.com/diegohaz/constate
 * * https://github.com/jamiebuilds/unstated-next
 */

import React, { createContext, useContext } from 'react';

interface ContextProviderProps {
  name: string;
  Context: React.Context<{}>;
  children: JSX.Element[] | JSX.Element;
}

const createConuse = (useWhatever = {}, bridges = {}) => {
  const names = Object.keys(useWhatever);

  const contextMap = names.reduce(
    (acc, name) => {
      const Context = createContext({});
      return { ...acc, [name]: Context };
    },
    Object.keys(bridges).reduce((acc, name) => {
      const [, Context] = bridges[name];
      return { ...acc, [name]: Context };
    }, {})
  );

  const ContextProvider = ({ children, name, Context }: ContextProviderProps) => (
    <Context.Provider value={{ [name]: useWhatever[name]() }}>{children}</Context.Provider>
  );

  const ConuseProvider = ({ children }) => names.reduce(
    (Composed, name) => {
      const Context = contextMap[name];
      return (
        <ContextProvider Context={Context} name={name}>
          {Composed}
        </ContextProvider>
      );
    },
    Object.keys(bridges).reduce((Composed, name) => {
      const [TheBridgeProvider] = bridges[name];
      return <TheBridgeProvider>{Composed}</TheBridgeProvider>;
    }, children)
  );

  const useConuseContext = (name?: string) => {
    if (name) {
      if (typeof contextMap[name] === 'function') {
        return contextMap[name]();
      } else {
        return useContext(contextMap[name])[name];
      }
    } else {
      return names.reduce(
        (acc, $name) => ({ ...acc, [$name]: () => useContext(contextMap[$name])[$name] }),
        {}
      );
    }
  };

  return { ConuseProvider, useConuseContext };
};

export default createConuse;
