import { useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

// Is part of form-atoms, but not factored-out
// https://github.com/form-atoms/form-atoms/pull/70
export const useHydrateField = (fieldAtom, initialValue, options) => {
  const field = useAtomValue(fieldAtom);
  useHydrateAtoms(
    initialValue
      ? [
          [field.value, initialValue],
          [field._initialValue, initialValue],
        ]
      : [],
    options,
  );
};
