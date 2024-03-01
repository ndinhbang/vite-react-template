import { useCheckboxGroup } from '../../hooks';

export const CheckboxGroup = ({ field, options, getValue, getLabel, initialValue }) => {
  const checkboxGroup = useCheckboxGroup(
    {
      field,
      options,
      getValue,
      getLabel,
    },
    { initialValue },
  );

  return (
    <>
      {checkboxGroup.map((checkboxProps) => (
        <div key={checkboxProps.id}>
          <input {...checkboxProps} />
          <label htmlFor={checkboxProps.id}>{checkboxProps.label}</label>
        </div>
      ))}
    </>
  );
};
