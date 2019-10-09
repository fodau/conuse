/**
 * Inspired by
 * * https://github.com/diegohaz/constate
 * * https://github.com/jamiebuilds/unstated-next
 */

import React, { useContext, createContext, Fragment } from 'react';

const isFunction: (fn: any) => boolean = fn => typeof fn === 'function';

type EmptyContext = React.Context<{}>;

interface ContextProviderProps {
  name: string;
  Context: EmptyContext;
  children: React.ReactElement | React.ReactElement[];
}

interface Obj {
  [name: string]: any;
}

// TODO 先用 any 解决了，React.ReactElement | React.ReactElement[] 一直有问题
interface ConuseProviderProps {
  children: any;
  value?: Obj;
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
  useMap: { [name: string]: () => any },
  conuseMap?: { [name: string]: IConuse }
) => IConuse = (useMap = {}, conuseMap = {}) => {
  const store = createStore();
  const names = Object.keys(useMap);
  const NormalContext = createContext<Obj | undefined>({});

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
    <Context.Provider value={{ [name]: useMap[name]() }}>{children}</Context.Provider>
  );

  const StoreComponent = () => {
    const context = useConuseContext();
    store.set(
      Object.keys(context).reduce((acc, name) => {
        if (isFunction(context[name])) {
          return { ...acc, [name]: context[name]() };
        } else {
          return { ...acc, name };
        }
      }, {})
    );
    return null;
  };

  const ConuseProvider: IConuse['ConuseProvider'] = ({ children, value }: ConuseProviderProps) => names.reduce(
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
      <NormalContext.Provider value={value}>
        <Fragment>
          <StoreComponent />
          {children}
        </Fragment>
      </NormalContext.Provider>
    )
  );

  const useConuseContext: IConuse['useConuseContext'] = (name) => {
    if (name) {
      if (isFunction(contextMap[name])) {
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
        { ...useContext(NormalContext) }
      );
    }
  };

  return { ConuseProvider, useConuseContext, getContext: store.get };
};

export default createConuse;
