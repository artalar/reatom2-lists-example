import { Atom, createTemplateCache, Transaction } from "@reatom/core";

let debounceCount = 0;
export function withDebounce<T extends Atom>(ms: number, atom: T): T {
  const key = `__DEBOUNCE [${++debounceCount}]`;
  const invalidateType = `invalidate ${key}`;
  const decoratedAtom: T = Object.assign(
    (transaction: Transaction, cache = createTemplateCache(decoratedAtom)) => {
      if (key in cache.ctx === false) {
        cache = atom(transaction, cache);
        cache.ctx[key] = -1;
        return cache;
      }

      let shouldScheduleInvalidate = true;

      transaction.actions.forEach((action) => {
        if (action.type === invalidateType) {
          shouldScheduleInvalidate = false;
          cache = atom(transaction, cache);
        }
      });

      if (shouldScheduleInvalidate) {
        transaction.schedule((dispatch) => {
          clearInterval(cache.ctx[key] as any);
          cache.ctx[key] = setTimeout(
            () =>
              dispatch({
                type: invalidateType,
                payload: null,
                targets: [decoratedAtom]
              }),
            ms
          );
        });
      }

      return cache;
    },
    atom
  );

  return decoratedAtom;
}
