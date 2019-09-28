/**
 * Inspired by
 * * https://github.com/diegohaz/constate
 * * https://github.com/jamiebuilds/unstated-next
 */

import React, { createContext, useContext } from 'react';

type EmptyContext = React.Context<{}>;

interface ContextProviderProps {
  name: string;
  Context: EmptyContext;
  children: React.ReactElement | React.ReactElement[];
}

// TODO 先用 any 解决了，React.ReactElement | React.ReactElement[] 一直有问题
interface ConuseProviderProps {
  children: any;
}

interface Obj {
  [name: string]: any;
}

const createConuse = (useWhatever: { [name: string]: () => any } = {}, bridges: Obj = {}) => {
  const names = Object.keys(useWhatever);

  const contextMap: { [name: string]: EmptyContext | Function } = names.reduce(
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

  const ConuseProvider = ({ children }: ConuseProviderProps) =>
    names.reduce(
      (Composed, name) => {
        const Context = contextMap[name] as EmptyContext;
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
        return (contextMap[name] as Function)();
      } else {
        return useContext<Obj>(contextMap[name] as EmptyContext)[name];
      }
    } else {
      return names.reduce(
        (acc, $name) => ({
          ...acc,
          [$name]: () => useContext<Obj>(contextMap[$name] as EmptyContext)[$name],
        }),
        {}
      );
    }
  };

  return { ConuseProvider, useConuseContext };
};

export default createConuse;
