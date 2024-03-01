import { useFieldProps } from '../';

const getNumber = (event) => {
  const { valueAsNumber } = event.currentTarget;
  // empty input "" is read as NaN, so we transform it to the undefined
  return Number.isNaN(valueAsNumber) ? undefined : valueAsNumber;
};

export const useNumberFieldProps = (field, options) => {
  // transform undefined to "" to make the number input empty
  const { value = '', ...props } = useFieldProps(field, getNumber, options);

  return { ...props, value };
};
