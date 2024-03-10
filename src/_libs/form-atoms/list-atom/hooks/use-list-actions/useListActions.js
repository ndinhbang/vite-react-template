import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo, useTransition } from 'react';

export const useListActions = (listAtom, options) => {
  const atoms = useAtomValue(listAtom);
  const validate = useSetAtom(atoms.validate, options);
  const dispatchSplitList = useSetAtom(atoms._splitList, options);
  const [, startTransition] = useTransition();

  const remove = useCallback((item) => {
    dispatchSplitList({ type: 'remove', atom: item });
    startTransition(() => {
      validate('change');
    });
  }, []);

  const add = useCallback((before, fields) => {
    dispatchSplitList({
      type: 'insert',
      value: atoms.buildItem(fields),
      before,
    });
    startTransition(() => {
      validate('change');
    });
  }, []);

  const move = useCallback((item, before) => {
    dispatchSplitList({ type: 'move', atom: item, before });
  }, []);

  return useMemo(() => ({ remove, add, move }), [remove, add, move]);
};
