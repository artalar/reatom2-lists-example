import React from "react";
import ReactDOM from "react-dom";
import { Atom, createStore, IActionCreator, IAtom, IStore } from "@reatom/core";

export const storeContext = React.createContext<IStore>(null);

export function useAction<T>(actionCreator: IActionCreator<T>, deps = []) {
  const store = React.useContext(storeContext);

  return React.useCallback(
    (payload: T) =>
      ReactDOM.unstable_batchedUpdates(() =>
        store.dispatch(actionCreator(payload))
      ),
    deps
  );
}

export function useAtom<T>(atomCreator: () => IAtom<T>): T {
  const store = React.useContext(storeContext);
  const [, update] = React.useReducer((s) => s + 1, 0);
  const unsubscribeRef = React.useRef(() => {});
  const atomRef = React.useRef(null as IAtom<T>);
  if (!atomRef.current)
    unsubscribeRef.current = store.subscribe(
      (atomRef.current = atomCreator()),
      update
    );

  React.useEffect(() => unsubscribeRef.current, []);

  return store.getState(atomRef.current);
}
