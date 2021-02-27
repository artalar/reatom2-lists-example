import React from "react";
import ReactDOM from "react-dom";
import { IAction, IAtom, isAtom, IStore } from "@reatom/core";

export const storeContext = React.createContext<IStore>(null);

export function useAction<T = void>(
  actionCreator: (payload: T) => IAction<T> | [IAction<T>],
  deps = []
) {
  const store = React.useContext(storeContext);

  return React.useCallback((payload: T) => {
    const action = actionCreator(payload);
    ReactDOM.unstable_batchedUpdates(() => {
      store.dispatch(...(Array.isArray(action) ? action : [action]));
    });
  }, deps.concat(store));
}

export function useAtom<T>(atom: IAtom<T>): T;
export function useAtom<T>(atomCreator: () => IAtom<T>): T;
export function useAtom<T>(atomCreatorOrAtom: IAtom<T> | (() => IAtom<T>)): T {
  const store = React.useContext(storeContext);
  const atomRef = React.useRef<IAtom<T>>();
  if (atomRef.current === undefined) {
    atomRef.current = isAtom(atomCreatorOrAtom)
      ? atomCreatorOrAtom
      : atomCreatorOrAtom();
  }
  const [state, update] = React.useState(() => store.getState(atomRef.current));

  React.useEffect(() => store.subscribe(atomRef.current, update), []);

  return state;
}
