import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';

export const useRequiredProps = ({ field, required: manualRequired }) => {
  const atom = useAtomValue(field);
  const isFieldRequired = useAtomValue(atom.required);

  // when field is required, prefer the manualRequired
  const required = isFieldRequired && (manualRequired ?? true);

  return useMemo(
    () => ({
      required,
      'aria-required': required,
    }),
    [required],
  );
};

export const useRequiredActions = (fieldAtom) => {
  const field = useAtomValue(fieldAtom);
  const setRequired = useSetAtom(field.required);

  return useMemo(
    () => ({
      setRequired,
    }),
    [setRequired],
  );
};
