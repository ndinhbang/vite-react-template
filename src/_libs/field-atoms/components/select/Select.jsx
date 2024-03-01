import { useSelectFieldProps, useSelectOptions } from '../../hooks';
import { PlaceholderOption } from '../placeholder-option';

export const Select = ({
  field,
  getValue,
  getLabel,
  options,
  placeholder = 'Please select an option',
  initialValue,
}) => {
  const props = useSelectFieldProps(
    {
      field,
      options,
      getValue,
    },
    { initialValue },
  );

  const { selectOptions } = useSelectOptions({
    field,
    options,
    getLabel,
  });

  return (
    <select {...props}>
      {placeholder && (
        <PlaceholderOption disabled={props.required}>{placeholder}</PlaceholderOption>
      )}
      {selectOptions}
    </select>
  );
};
