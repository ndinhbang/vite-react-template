import { useMultiSelectFieldProps, useSelectOptions } from '../../hooks';

export const MultiSelect = ({ field, getValue, getLabel, options, initialValue }) => {
  const props = useMultiSelectFieldProps(
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
    <select
      multiple
      {...props}
    >
      {selectOptions}
    </select>
  );
};
