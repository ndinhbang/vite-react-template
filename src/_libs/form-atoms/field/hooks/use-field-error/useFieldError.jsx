import { useFieldState } from 'form-atoms';

export const useFieldError = (field) => {
  const { validateStatus, errors, touched } = useFieldState(field);
  const isInvalid = touched && validateStatus === 'invalid';
  const isSuccess = touched && validateStatus === 'valid';

  return {
    isInvalid,
    isSuccess,
    error: errors[0],
    errors,
  };
};
