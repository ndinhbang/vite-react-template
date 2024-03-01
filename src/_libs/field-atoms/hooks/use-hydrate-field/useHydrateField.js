import { useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

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
