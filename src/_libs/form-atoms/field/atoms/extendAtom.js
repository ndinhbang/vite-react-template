import { atom } from 'jotai';

export const extendAtom = (baseAtom, makeAtoms) => {
  const extended = atom(
    (get) => {
      const base = get(baseAtom);
      return {
        ...base,
        ...makeAtoms(base, get),
      };
    },
    (get, set, update) => {
      set(baseAtom, { ...get(baseAtom), ...update });
    },
  );

  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    baseAtom.debugPrivate = true;
    extended.debugLabel = baseAtom.debugLabel;
  }

  return extended;
};
