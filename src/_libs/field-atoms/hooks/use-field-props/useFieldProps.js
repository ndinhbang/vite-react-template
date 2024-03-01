import { useField } from 'form-atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo, useTransition } from 'react';

export function useFieldProps(
  fieldAtom,
  // support element to be union via distributive conditional types
  getEventValue,
  options,
) {
  const { actions, state } = useField(fieldAtom, options);
  const field = useAtomValue(fieldAtom);
  const name = useAtomValue(field.name);
  const required = useAtomValue(field.required);
  const validationCount = useAtomValue(field._validateCount);
  const validate = useSetAtom(field.validate);
  const ref = useSetAtom(field.ref);
  const [, startTransition] = useTransition();

  const ariaInvalid = state.validateStatus === 'invalid';
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid
  const requiredAriaInvalid = validationCount > 0 ? ariaInvalid : undefined;

  return useMemo(
    () => ({
      id: `${fieldAtom}`,
      name,
      value: state.value,
      required,
      'aria-required': required,
      'aria-invalid': required ? requiredAriaInvalid : ariaInvalid,
      ref,
      onBlur() {
        actions.setTouched(true);

        startTransition(() => {
          validate('blur');
        });
      },
      onChange(event) {
        const maybeValue = getEventValue(event, state.value);

        actions.setValue(maybeValue);

        startTransition(() => {
          validate('change');
        });
      },
    }),
    [state, actions, name, required, validationCount, getEventValue, ref, validate],
  );
}
