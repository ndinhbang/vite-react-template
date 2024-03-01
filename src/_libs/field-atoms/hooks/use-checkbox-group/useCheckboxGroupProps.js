import { useAtomValue } from 'jotai';
import { useMemo, useRef } from 'react';

import { useFieldProps } from '../';

export const useCheckboxGroupFieldProps = ({ field, options, getValue }, fieldOptions) => {
  const atom = useAtomValue(field);
  const fieldValue = useAtomValue(atom.value);
  const optionValues = useMemo(() => options.map(getValue), [getValue, options]);

  const prevValue = useRef(fieldValue);

  const activeIndexes = useRef(
    fieldValue.map((activeOption) => optionValues.indexOf(activeOption)),
  );

  if (prevValue.current != fieldValue) {
    /**
     * The field was set from outside via initialValue, reset action, or set manually.
     * Recompute the indexes.
     **/
    activeIndexes.current = fieldValue.map((activeOption) => optionValues.indexOf(activeOption));
  }

  const getEventValue = (event) => {
    const index = parseInt(event.currentTarget.value);
    const nextIndexes = event.currentTarget.checked
      ? [...activeIndexes.current, index]
      : activeIndexes.current.filter((val) => val != index);

    activeIndexes.current = nextIndexes;

    const nextValues = nextIndexes.map((index) => optionValues[index]);

    /**
     * When user change event happened, we set the value.
     * On the next render when the fieldValue is updated, we can skip calculating the activeIndexes.
     */
    prevValue.current = nextValues;

    return nextValues;
  };

  const props = useFieldProps(field, getEventValue, fieldOptions);

  return { ...props, value: activeIndexes.current };
};
