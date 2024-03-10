import { useMemo } from 'react';

import { useFieldProps } from '../';

const getChecked = (event) => event.currentTarget.checked;

export function useCheckboxFieldProps(field, options) {
  // undefined (empty checkbox) is rendered as unchecked input
  const { value: checked = false, ...props } = useFieldProps(field, getChecked, options);

  return useMemo(
    () => ({
      checked,
      role: 'checkbox',
      'aria-checked': checked,
      ...props,
    }),
    [checked, props],
  );
}
