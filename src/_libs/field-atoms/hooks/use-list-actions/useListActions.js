import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useTransition } from 'react';

import { listItemForm } from '../../atoms/list-atom/listItemForm';

export const useListActions = (list, options) => {
  const atoms = useAtomValue(list);
  const validate = useSetAtom(atoms.validate, options);
  const dispatchSplitList = useSetAtom(atoms._splitList);
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
      value: fields
        ? listItemForm({
            fields,
            getListNameAtom: (get) => get(list).name,
            formListAtom: atoms._formList,
          })
        : atoms.buildItem(),
      before,
    });
    startTransition(() => {
      validate('change');
    });
  }, []);

  const move = useCallback((item, before) => {
    dispatchSplitList({ type: 'move', atom: item, before });
  }, []);

  return { remove, add, move };
};
