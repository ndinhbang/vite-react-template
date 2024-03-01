import { useAtomValue, useStore } from 'jotai';
import { useEffect } from 'react';

// older variant of form-atoms's useFIV hook without the areEqual checks
// https://github.com/form-atoms/form-atoms/blob/17398098a901649059586dd3be815fffde14348c/src/index.tsx#L1039
/**
 * Sets the initial value of a field atom.
 *
 * @param fieldAtom - The atom that you want to use to store the value.
 * @param initialValue - The initial value of the field or `RESET` to reset the initial value.
 * @param options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 */
export function _useFieldInitialValue(fieldAtom, initialValue, options) {
  const field = useAtomValue(fieldAtom, options);
  const store = useStore(options);

  useEffect(() => {
    if (initialValue === undefined) {
      return;
    }
    store.set(field.value, initialValue);
  }, [store, field.value, initialValue]);
}
