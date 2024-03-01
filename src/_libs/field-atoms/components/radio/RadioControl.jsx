import { atom } from 'jotai';
import { useMemo } from 'react';

const radioControlAtom = () => atom(undefined);

export const RadioControl = ({ name, children }) => {
  /**
   * Atom to keep track of currently active checkbox fieldAtom.
   */
  const control = useMemo(() => {
    const atom = radioControlAtom();
    atom.debugLabel = `radioControl/${name}`;
    return atom;
  }, []);

  return children({ control });
};
