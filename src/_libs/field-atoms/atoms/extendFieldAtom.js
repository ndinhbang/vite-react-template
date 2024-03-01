import { atom } from 'jotai';

export const extendFieldAtom = (field, makeAtoms) =>
  atom(
    (get) => {
      const base = get(field);
      return {
        ...base,
        ...makeAtoms(base, get),
      };
    },
    (get, set, update) => {
      // @ts-expect-error fieldAtom is PrimitiveAtom
      set(field, { ...get(field), ...update });
    },
  );
