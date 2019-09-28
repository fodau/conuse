/**
 * Inspired by
 * * https://github.com/diegohaz/constate
 * * https://github.com/jamiebuilds/unstated-next
 */

import React, { createContext, useContext, Fragment } from 'react';

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

interface IStore {
  get: (name?: string) => any;
  set: (store: any) => void;
}

interface IConuse {
  ConuseProvider: React.FC<ConuseProviderProps>;
  useConuseContext: (name?: string) => any;
  getContext: IStore['get'];
}

const createStore: () => IStore = () => {
  let store: any = null;
  return {
    get: name => (name ? store[name] : store),
    set: ($store) => {
      store = $store;
    },
  };
};

const createConuse: (
  useWhatever: { [name: string]: () => any },
  conuseMap?: { [name: string]: IConuse }
) => IConuse = (useWhatever = {}, conuseMap = {}) => {
  const store = createStore();
  const names = Object.keys(useWhatever);

  const contextMap: { [name: string]: EmptyContext | Function } = names.reduce(
    (acc, name) => {
      const Context = createContext({});
      return { ...acc, [name]: Context };
    },
    Object.keys(conuseMap).reduce((acc, name) => {
      const conuse = conuseMap[name];
      return { ...acc, [name]: conuse.useConuseContext };
    }, {})
  );

  const ContextProvider = ({ children, name, Context }: ContextProviderProps) => (
    <Context.Provider value={{ [name]: useWhatever[name]() }}>{children}</Context.Provider>
  );

  const StoreComponent = () => {
    const context = useConuseContext();
    store.set(
      Object.keys(context).reduce((acc, name) => ({ ...acc, [name]: context[name]() }), {})
    );
    return null;
  };

  const ConuseProvider: IConuse['ConuseProvider'] = ({ children }: ConuseProviderProps) => names.reduce(
    (Composed, name) => {
      const Context = contextMap[name] as EmptyContext;
      return (
        <ContextProvider Context={Context} name={name}>
          {Composed}
        </ContextProvider>
      );
    },
    Object.keys(conuseMap).reduce(
      (Composed, name) => {
        const conuse = conuseMap[name];
        return <conuse.ConuseProvider>{Composed}</conuse.ConuseProvider>;
      },
      <Fragment>
        <StoreComponent />
        {children}
      </Fragment>
    )
  );

  const useConuseContext: IConuse['useConuseContext'] = (name) => {
    if (name) {
      if (typeof contextMap[name] === 'function') {
        return (contextMap[name] as Function)(name);
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

  return { ConuseProvider, useConuseContext, getContext: store.get };
};

export default createConuse;
