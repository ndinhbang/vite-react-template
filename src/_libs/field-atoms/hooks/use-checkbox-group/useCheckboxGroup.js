import { useCheckboxGroupFieldProps } from './useCheckboxGroupProps';
import { useOptions } from '../use-options';

export const useCheckboxGroup = ({ field, getValue, getLabel, options }, fieldOptions) => {
  const props = useCheckboxGroupFieldProps({ field, options, getValue }, fieldOptions);

  const { renderOptions } = useOptions({
    field,
    getLabel,
    options,
  });

  // when one option is selected, thats enough for the required multiselect to be filled
  const required = props.value.length === 0 ? props.required : false;

  return renderOptions.map((option) => ({
    ...props,
    ...option,
    type: 'checkbox',
    required,
    checked: props.value.includes(option.value),
  }));
};
