import { useFieldErrors } from 'form-atoms';

export const FieldErrors = ({ field, children = ({ errors }) => <>{errors.join('\n')}</> }) =>
  children({ errors: useFieldErrors(field) });
