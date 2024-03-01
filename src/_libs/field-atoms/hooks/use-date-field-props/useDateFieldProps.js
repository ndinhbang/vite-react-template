import { useFieldProps } from '../';

const getDate = (event) => {
  const { valueAsDate } = event.currentTarget;

  // empty input "" is read as null, so we normalize to undefined
  return valueAsDate
    ? // valueAsDate instanceof Date does not work in test, so we instantiate it explicitly to make it work
      new Date(event.currentTarget.valueAsNumber)
    : undefined;
};

export const useDateFieldProps = (field, options) => useFieldProps(field, getDate, options);
