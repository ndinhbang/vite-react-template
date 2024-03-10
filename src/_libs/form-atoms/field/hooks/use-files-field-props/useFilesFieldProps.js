import { useFieldProps } from '../';

const getFiles = (event) => Array.from(event.currentTarget.files ?? []);

export const useFilesFieldProps = (field, options) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, ...props } = useFieldProps(field, getFiles, options);

  return props;
};
