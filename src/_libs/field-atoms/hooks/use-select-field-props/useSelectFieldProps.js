import { useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';

import { useFieldProps } from '..';

/**
 * When field is empty, we map the undefined from data layer to -1 on presentation (UI) layer.
 */
export const EMPTY_SELECT_VALUE = -1;

export const useSelectFieldProps = ({ field, options, getValue }, fieldOptions) => {
  const atom = useAtomValue(field);
  const fieldValue = useAtomValue(atom.value);
  // TODO: getValue should be useMemo dependency, currently we asume that it is stable
  const values = useMemo(() => options.map(getValue), [options]);
  const value = useMemo(() => values.indexOf(fieldValue), [fieldValue, values]);

  const getEventValue = useCallback(
    (event) => {
      const { value } = event.currentTarget;
      const index = parseInt(value);
      const activeValue = values[index];

      return activeValue;
    },
    [values],
  );

  const props = useFieldProps(field, getEventValue, fieldOptions);

  return { ...props, value };
};
