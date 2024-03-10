import { useFieldProps } from '../';

const getEventValue = (event) => event.currentTarget.value;

export const useTextFieldProps = (field, options) => useFieldProps(field, getEventValue, options);
