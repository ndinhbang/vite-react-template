import * as React from 'react';

import { atom, Provider, useAtom, useAtomValue, useSetAtom, useStore } from 'jotai';
import { atomWithReset, RESET, useHydrateAtoms } from 'jotai/utils';

import { formatDateString, setPath } from './utils';

export { Provider } from 'jotai';

//
// Components
//

/**
 * A React component that renders form atoms and their fields in an isolated
 * scope using a Jotai Provider.
 *
 * @param {FormProps<Fields>} props - Component props
 */
export function Form(props) {
  return (
    <Provider store={props.store}>
      <FormAtom {...props} />
    </Provider>
  );
}

function FormAtom(props) {
  const form = useForm(props.atom);

  if ('render' in props) {
    return props.render(form);
  }

  return React.createElement(props.component, form);
}

/**
 * A React component that renders field atoms with initial values. This is
 * most useful for fields that are rendered as native HTML elements because
 * the props can unpack directly into the underlying component.
 *
 * @param {FieldProps<Value>} props - Component props
 */
export function InputField(props) {
  const fieldAtom = useInputField(props.atom, props);
  return render(props, fieldAtom);
}

/**
 * A React component that renders field atoms with initial values. This is
 * most useful for fields that are rendered as native HTML elements because
 * the props can unpack directly into the underlying component.
 *
 * @param {FieldProps<Value>} props - Component props
 */
export function SelectField(props) {
  const fieldAtom = useSelectField(props.atom, props);
  return render(props, fieldAtom);
}

/**
 * A React component that renders field atoms with initial values. This is
 * most useful for fields that are rendered as native HTML elements because
 * the props can unpack directly into the underlying component.
 *
 * @param {FieldProps<Value>} props - Component props
 */
export function TextareaField(props) {
  const fieldAtom = useTextareaField(props.atom, props);
  return render(props, fieldAtom);
}

function render(props, fieldAtom) {
  if ('render' in props) {
    return props.render(fieldAtom.props, fieldAtom.state, fieldAtom.actions);
  }

  return React.createElement(props.component, fieldAtom.props);
}

/**
 * A React component that renders field atoms with initial values. This is
 * most useful for fields that aren't rendered as native HTML elements.
 *
 * @param {FieldProps<Value>} props - Component props
 */
export function Field(props) {
  const { state, actions } = useField(props.atom, props);

  if ('render' in props) {
    return props.render(state, actions);
  }

  return React.createElement(props.component, { state, actions });
}

//
// Forms
//

/**
 * An atom that derives its state fields atoms and allows you to submit,
 * validate, and reset your form.
 *
 * @param {FormFields} fields - An object containing field atoms to
 *   be included in the form. Field atoms can be deeply nested in
 *   objects and arrays.
 * @returns The `formAtom` function returns a Jotai `Atom`
 *   comprised of other atoms for managing the state of the form.
 */
export function formAtom(fields) {
  const fieldsAtom = atomWithReset(fields);
  const valuesAtom = atom((get) => {
    const fields = get(fieldsAtom);
    const values = {};

    walkFields(
      fields,
      (field, path) => {
        if (field) {
          const fieldAtom = get(field);
          setPath(values, path, get(fieldAtom.value));
        } else {
          setPath(values, path, []);
        }
      },
      { includeEmptyArrays: true },
    );

    return values;
  });

  async function validateFields(get, set, event) {
    const fields = get(fieldsAtom);
    const promises = [];

    walkFields(fields, (nextField) => {
      async function validate(field) {
        const fieldAtom = get(field);
        const value = get(fieldAtom.value);
        const dirty = get(fieldAtom.dirty);
        // This pointer prevents a stale validation result from being
        // set after the most recent validation has been performed.
        const ptr = get(fieldAtom._validateCount) + 1;
        set(fieldAtom._validateCount, ptr);

        if (event === 'user' || event === 'submit') {
          set(fieldAtom.touched, true);
        }

        const maybePromise = fieldAtom._validateCallback?.({
          get,
          set,
          value,
          dirty,
          touched: get(fieldAtom.touched),
          event,
        });

        let errors;

        if (isPromise(maybePromise)) {
          set(fieldAtom.validateStatus, 'validating');
          errors = (await maybePromise) ?? get(fieldAtom.errors);
        } else {
          errors = maybePromise ?? get(fieldAtom.errors);
        }

        if (ptr === get(fieldAtom._validateCount)) {
          set(fieldAtom.errors, errors);
          set(fieldAtom.validateStatus, errors.length > 0 ? 'invalid' : 'valid');
        }

        if (errors && errors.length) {
          return false;
        }

        return true;
      }

      promises.push(validate(nextField));
    });

    await Promise.all(promises);
  }

  const validateStatusAtom = atom((get) => {
    const fields = get(fieldsAtom);
    let status = 'valid';

    walkFields(fields, (field) => {
      const fieldAtom = get(field);
      const fieldStatus = get(fieldAtom.validateStatus);

      if (fieldStatus === 'validating') {
        status = 'validating';
        return false;
      } else if (fieldStatus === 'invalid') {
        status = 'invalid';
        return false;
      }
    });

    return status;
  });

  const validateAtom = atom(null, (get, set, event = 'user') => {
    event && validateFields(get, set, event);
  });

  const errorsAtom = atom((get) => {
    const fields = get(fieldsAtom);
    const errors = {};

    walkFields(fields, (field, path) => {
      const fieldAtom = get(field);
      setPath(errors, path, get(fieldAtom.errors));
    });

    return errors;
  });

  const submitCountAtom = atom(0);
  const submitStatusCountAtom = atom(0);
  const submitStatusAtom = atom('idle');
  const submitAtom = atom(null, (get, set, onSubmit) => {
    async function resolveSubmit() {
      // This pointer prevents a stale validation result from being
      // set after the most recent validation has been performed.
      const ptr = get(submitStatusCountAtom) + 1;
      set(submitStatusCountAtom, ptr);
      set(submitCountAtom, (count) => ++count);
      await validateFields(get, set, 'submit');
      const validateStatus = get(validateStatusAtom);

      if (validateStatus === 'invalid') {
        return ptr === get(submitStatusCountAtom) && set(submitStatusAtom, 'idle');
      }

      const submission = onSubmit(get(valuesAtom));

      try {
        if (isPromise(submission)) {
          ptr === get(submitStatusCountAtom) && set(submitStatusAtom, 'submitting');
          await submission;
        }
        // eslint-disable-next-line no-empty
      } catch (err) {
      } finally {
        if (ptr === get(submitStatusCountAtom)) {
          set(submitStatusAtom, 'submitted');
        }
      }
    }

    resolveSubmit();
  });

  const dirtyAtom = atom((get) => {
    const fields = get(fieldsAtom);
    let dirty = false;

    walkFields(fields, (field) => {
      const fieldAtom = get(field);
      dirty = get(fieldAtom.dirty);
      if (dirty) return false;
    });

    return dirty;
  });

  const touchedFieldsAtom = atom((get) => {
    const fields = get(fieldsAtom);
    const touchedFields = {};

    walkFields(fields, (field, path) => {
      const fieldAtom = get(field);
      setPath(touchedFields, path, get(fieldAtom.touched));
    });

    return touchedFields;
  });

  const resetAtom = atom(null, (get, set) => {
    set(fieldsAtom, RESET);
    walkFields(get(fieldsAtom), (field) => {
      const fieldAtom = get(field);
      set(fieldAtom.reset);
    });
    set(submitStatusCountAtom, (current) => ++current);
    set(submitStatusAtom, 'idle');
  });

  const formAtoms = {
    fields: fieldsAtom,
    values: valuesAtom,
    errors: errorsAtom,
    dirty: dirtyAtom,
    touchedFields: touchedFieldsAtom,
    validate: validateAtom,
    validateStatus: validateStatusAtom,
    submit: submitAtom,
    submitStatus: submitStatusAtom,
    submitCount: submitCountAtom,
    reset: resetAtom,
    _validateFields: validateFields,
  };

  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    Object.entries(formAtoms).map(([atomName, atom]) => {
      if (isAtom(atom)) {
        atom.debugLabel = `form/${atomName}`;
      }
    });
  }

  return atom(formAtoms);
}

/**
 * A hook that returns an object that contains the `fieldAtoms` and actions to
 * validate, submit, and reset the form.
 *
 * @param {FormAtom<FormFields>} formAtom - The atom that stores the form state.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns A set of functions that can be used to interact
 *   with the form.
 */
export function useForm(formAtom, options) {
  const form = useAtomValue(formAtom, options);
  const fieldAtoms = useAtomValue(form.fields, options);
  const reset = useSetAtom(form.reset, options);
  const validate = useSetAtom(form.validate, options);
  const handleSubmit = useSetAtom(form.submit, options);
  const [, startTransition] = useTransition();

  return React.useMemo(
    () => ({
      fieldAtoms: fieldAtoms,
      validate() {
        startTransition(() => {
          validate('user');
        });
      },
      reset(event) {
        event?.preventDefault();
        startTransition(() => {
          reset();
        });
      },
      submit(onSubmit) {
        return (event) => {
          event?.preventDefault();
          startTransition(() => {
            handleSubmit(onSubmit);
          });
        };
      },
    }),
    [fieldAtoms, validate, reset, handleSubmit],
  );
}

/**
 * A hook that returns the primary state of the form atom including values, errors,
 * submit and validation status, as well as the `fieldAtoms`. Note that this
 * hook will cuase its parent component to re-render any time those states
 * change, so it can be useful to use more targeted state hooks like
 * `useFormStatus`.
 *
 * @param {FormAtom<FormFields>} formAtom - The atom that stores the form state.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 */
export function useFormState(formAtom, options) {
  const form = useAtomValue(formAtom, options);
  const fieldAtoms = useAtomValue(form.fields, options);
  const submitCount = useAtomValue(form.submitCount, options);
  const submitStatus = useAtomValue(form.submitStatus, options);
  const validateStatus = useAtomValue(form.validateStatus, options);
  const values = useAtomValue(form.values, options);
  const errors = useAtomValue(form.errors, options);
  const dirty = useAtomValue(form.dirty, options);
  const touchedFields = useAtomValue(form.touchedFields, options);

  return React.useMemo(
    () => ({
      fieldAtoms,
      values,
      errors,
      dirty,
      touchedFields,
      submitCount,
      submitStatus,
      validateStatus,
    }),
    [fieldAtoms, values, errors, dirty, touchedFields, submitCount, submitStatus, validateStatus],
  );
}

/**
 * A hook that returns a set of actions that can be used to update the state
 * of the form atom. This includes updating fields, submitting, resetting,
 * and validating the form.
 *
 * @param {FormAtom<FormFields>} formAtom - The atom that stores the form state.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 */
export function useFormActions(formAtom, options) {
  const form = useAtomValue(formAtom, options);
  const updateFields = useSetAtom(form.fields, options);
  const reset = useSetAtom(form.reset, options);
  const validate = useSetAtom(form.validate, options);
  const handleSubmit = useSetAtom(form.submit, options);
  const submit = React.useCallback(
    (values) => (e) => {
      e?.preventDefault();
      handleSubmit(values);
    },
    [handleSubmit],
  );
  const [, startTransition] = useTransition();

  return React.useMemo(
    () => ({
      updateFields,
      reset,
      validate() {
        startTransition(() => {
          validate('user');
        });
      },
      submit,
    }),
    [updateFields, reset, validate, submit],
  );
}

/**
 * A hook that returns the errors of the form atom.
 *
 * @param {FormAtom<FormFields>} formAtom - The atom that stores the form data.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns The errors of the form.
 */
export function useFormErrors(formAtom, options) {
  const form = useAtomValue(formAtom, options);
  return useAtomValue(form.errors, options);
}

/**
 * A hook that returns the values of the form atom
 *
 * @param {FormAtom<FormFields>} formAtom - The atom that stores the form state.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns The values of the form.
 */
export function useFormValues(formAtom, options) {
  const form = useAtomValue(formAtom, options);
  return useAtomValue(form.values, options);
}

/**
 * A hook that returns the `submitStatus` and `validateStatus` of
 * the form atom.
 *
 * @param {FormAtom<FormFields>} formAtom - The atom that stores the form state.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns An object containing the `submitStatus` and
 *   `validateStatus` of the form
 */
export function useFormStatus(formAtom, options) {
  const form = useAtomValue(formAtom);
  const submitStatus = useAtomValue(form.submitStatus, options);
  const validateStatus = useAtomValue(form.validateStatus, options);

  return React.useMemo(() => ({ submitStatus, validateStatus }), [submitStatus, validateStatus]);
}

/**
 * A hook that returns a callback for handling form submission.
 *
 * @param {FormAtom<FormFields>} formAtom - The atom that stores the form state.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns A callback for handling form submission. The callback
 *   takes the form values as an argument and returs an additional callback
 *   that invokes `event.preventDefault()` if it receives an event as its argument.
 */
export function useFormSubmit(formAtom, options) {
  const [, startTransition] = useTransition();
  const form = useAtomValue(formAtom, options);
  const handleSubmit = useSetAtom(form.submit, options);
  return React.useCallback(
    (values) => (e) => {
      e?.preventDefault();
      startTransition(() => {
        handleSubmit(values);
      });
    },
    [handleSubmit],
  );
}

//
// Fields
//

/**
 * An atom that represents a field in a form. It manages state for the field,
 * including the name, value, errors, dirty, validation, and touched state.
 *
 * @param {FieldAtomConfig<Value>} config - The initial state and configuration of the field.
 * @returns A FieldAtom.
 */
export function fieldAtom(config) {
  const nameAtom = atomWithReset(config.name);
  const initialValueAtom = atomWithReset(undefined);
  const baseValueAtom = atomWithReset(config.value);
  const valueAtom = atom(
    (get) => get(baseValueAtom),
    (_get, set, value) => {
      return config.preprocess && value !== RESET
        ? set(baseValueAtom, config.preprocess(value))
        : set(baseValueAtom, value);
    },
  );
  const touchedAtom = atomWithReset(config.touched ?? false);
  const dirtyAtom = atom((get) => {
    const initialValue = get(initialValueAtom) ?? config.value;
    return get(valueAtom) !== initialValue;
  });
  const errorsAtom = atom([]);

  const validateCountAtom = atom(0);
  const validateStatusAtom = atom('valid');
  const validateAtom = atom(null, (get, set, event = 'user') => {
    async function resolveErrors() {
      if (!event) return;
      // This pointer prevents a stale validation result from being
      // set to state after the most recent invocation of validate.
      const ptr = get(validateCountAtom) + 1;
      set(validateCountAtom, ptr);
      const dirty = get(dirtyAtom);
      const value = get(valueAtom);

      if (event === 'user' || event === 'submit') {
        set(touchedAtom, true);
      }

      let errors = [];

      const maybeValidatePromise = config.validate?.({
        get,
        set,
        dirty,
        touched: get(touchedAtom),
        value,
        event: event,
      });

      if (isPromise(maybeValidatePromise)) {
        ptr === get(validateCountAtom) && set(validateStatusAtom, 'validating');
        errors = (await maybeValidatePromise) ?? get(errorsAtom);
      } else {
        errors = maybeValidatePromise ?? get(errorsAtom);
      }

      if (ptr === get(validateCountAtom)) {
        set(errorsAtom, errors);
        set(validateStatusAtom, errors.length > 0 ? 'invalid' : 'valid');
      }
    }

    resolveErrors();
  });

  const refAtom = atom(null);

  const resetAtom = atom(null, (get, set) => {
    set(errorsAtom, []);
    set(touchedAtom, RESET);
    set(valueAtom, get(initialValueAtom) ?? config.value);
    // Need to set a new pointer to prevent stale validation results
    // from being set to state after this invocation.
    set(validateCountAtom, (count) => ++count);
    set(validateStatusAtom, 'valid');
  });

  const fieldAtoms = {
    name: nameAtom,
    value: valueAtom,
    touched: touchedAtom,
    dirty: dirtyAtom,
    validate: validateAtom,
    validateStatus: validateStatusAtom,
    errors: errorsAtom,
    reset: resetAtom,
    ref: refAtom,
    _initialValue: initialValueAtom,
    _validateCount: validateCountAtom,
    _validateCallback: config.validate,
  };

  const field = atom(fieldAtoms);

  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    Object.entries(fieldAtoms).map(([atomName, atom]) => {
      if (isAtom(atom)) {
        atom.debugLabel = `field/${atomName}/${config.name ?? `${field}`}`;
      }
    });
  }

  return field;
}

/**
 * A hook that returns a set of actions that can be used to interact with the
 * field atom state.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns A set of actions that can be used to interact with the field atom.
 */
export function useFieldActions(fieldAtom, options) {
  const field = useAtomValue(fieldAtom, options);
  const setValue = useSetAtom(field.value, options);
  const setTouched = useSetAtom(field.touched, options);
  const setErrors = useSetAtom(field.errors, options);
  const validate = useSetAtom(field.validate, options);
  const reset = useSetAtom(field.reset, options);
  const ref = useAtomValue(field.ref, options);
  const [, startTransition] = useTransition();

  return React.useMemo(
    () => ({
      validate() {
        startTransition(() => {
          validate('user');
        });
      },
      setValue(value) {
        setValue(value);
        startTransition(() => {
          validate('change');
        });
      },
      setTouched(touched) {
        setTouched(touched);

        if (touched) {
          startTransition(() => {
            validate('touch');
          });
        }
      },
      setErrors,
      focus() {
        ref?.focus();
      },
      reset,
    }),
    [setErrors, reset, validate, setValue, setTouched, ref],
  );
}

/**
 * A hook that returns a set of props that can be destructured
 * directly into an `<input>` element.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseInputFieldPropsOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns A set of props that can be destructured directly into an `<input>`.
 */
export function useInputFieldProps(fieldAtom, options = {}) {
  const field = useAtomValue(fieldAtom, options);
  const name = useAtomValue(field.name, options);
  const [value, setValue] = useAtom(field.value, options);
  const setTouched = useSetAtom(field.touched, options);
  const validateStatus = useAtomValue(field.validateStatus, options);
  const validate = useSetAtom(field.validate, options);
  const ref = useSetAtom(field.ref, options);
  const [, startTransition] = useTransition();
  const { type: fieldType = 'text' } = options;

  return React.useMemo(
    () => ({
      name,
      // @ts-expect-error: it's fine, we will test
      value: fileTypes.has(fieldType)
        ? undefined
        : value === null
          ? ''
          : Array.isArray(value)
            ? value.map((v) => v + '')
            : value instanceof Date
              ? formatDateString(value, fieldType)
              : value,
      'aria-invalid': validateStatus === 'invalid',
      // @ts-expect-error: it's fine because we default to string which == text
      type: fieldType,
      ref,
      onBlur() {
        setTouched(true);
        startTransition(() => {
          validate('blur');
        });
      },
      onChange(event) {
        const target = event.currentTarget;
        const setAnyValue = setValue;
        const anyFieldType = fieldType;

        setAnyValue(
          anyFieldType === 'datetime-local'
            ? new Date(target.valueAsNumber)
            : target[
                fileTypes.has(anyFieldType)
                  ? 'files'
                  : dateTypes.has(anyFieldType)
                    ? 'valueAsDate'
                    : numberTypes.has(anyFieldType)
                      ? 'valueAsNumber'
                      : 'value'
              ],
        );

        startTransition(() => {
          validate('change');
        });
      },
    }),
    [name, value, validateStatus, ref, setTouched, validate, setValue, fieldType],
  );
}

const numberTypes = new Set(['number', 'range']);
const dateTypes = new Set(['date', 'datetime-local', 'month', 'week', 'time']);
const fileTypes = new Set(['file']);

/**
 * A hook that returns a set of props that can be destructured
 * directly into an `<textarea>` element.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseTextareaFieldPropsOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns A set of props that can be destructured directly into an `<textarea>`.
 */
export function useTextareaFieldProps(fieldAtom, options = {}) {
  const props = useInputFieldProps(fieldAtom, options);
  // @ts-expect-error: we are futzing around with onChange/onBlur/ref but
  //  it's my library so I can do what I want
  return React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, ...forwardedProps } = props;
    return forwardedProps;
  }, [props]);
}

/**
 * A hook that returns a set of props that can be destructured
 * directly into an `<select>` element.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseSelectFieldPropsOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns A set of props that can be destructured directly into an `<select>`.
 */
export function useSelectFieldProps(fieldAtom, options = {}) {
  const field = useAtomValue(fieldAtom, options);
  const setValue = useSetAtom(field.value, options);
  const validate = useSetAtom(field.validate, options);
  const [, startTransition] = useTransition();
  const { multiple } = options;
  // @ts-expect-error: we will live
  const inputProps = useInputFieldProps(fieldAtom, options);

  return React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, onChange, ...forwardedProps } = inputProps;

    return {
      ...forwardedProps,
      multiple,

      onChange(event) {
        if (multiple) {
          const options = event.currentTarget.options;
          const values = [];

          for (const i in options) {
            const option = options[i];

            if (option.selected) {
              values.push(option.value);
            }
          }

          // @ts-expect-error: it's fine
          setValue(values);
        } else {
          // @ts-expect-error: it's fine
          setValue(event.currentTarget.value);
        }

        startTransition(() => {
          validate('change');
        });
      },
    };
  }, [inputProps, validate, startTransition, setValue, multiple]);
}

/**
 * A hook that returns the state of a field atom. This includes the field's
 * value, whether it has been touched, whether it is dirty, the validation status,
 * and any errors.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns The state of the field atom.
 */
export function useFieldState(fieldAtom, options) {
  const field = useAtomValue(fieldAtom, options);
  const value = useAtomValue(field.value, options);
  const touched = useAtomValue(field.touched, options);
  const dirty = useAtomValue(field.dirty, options);
  const validateStatus = useAtomValue(field.validateStatus, options);
  const errors = useAtomValue(field.errors, options);

  return React.useMemo(
    () => ({
      value,
      touched,
      dirty,
      validateStatus,
      errors,
    }),
    [value, touched, dirty, validateStatus, errors],
  );
}

/**
 * A hook that returns the value of a field atom.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns The value of the field atom.
 */
export function useFieldValue(fieldAtom, options) {
  const field = useAtomValue(fieldAtom, options);
  return useAtomValue(field.value, options);
}

/**
 * A hook that returns the errors of a field atom.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 * @returns The errors of the field atom.
 */
export function useFieldErrors(fieldAtom, options) {
  const field = useAtomValue(fieldAtom, options);
  return useAtomValue(field.errors, options);
}

/**
 * Sets the initial value of a field atom.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that you want to use to store the value.
 * @param {Value} initialValue - The initial value of the field or `RESET` to reset the initial value.
 * @param {UseAtomOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 */
export function useFieldInitialValue(fieldAtom, initialValue, options) {
  const field = useAtomValue(fieldAtom, options);
  const store = useStore(options);
  useHydrateAtoms(
    initialValue
      ? [
          [field._initialValue, initialValue],
          [field.value, initialValue],
        ]
      : [],
    options,
  );

  React.useEffect(() => {
    const areEqual = (options && options.areEqual) || defaultValuesAreEqual;

    if (initialValue === undefined) {
      return;
    }

    if (!store.get(field.dirty) && !areEqual(initialValue, store.get(field.value))) {
      store.set(field.value, initialValue);
    }

    if (!areEqual(initialValue, store.get(field._initialValue))) {
      store.set(field._initialValue, initialValue);
    }
  });
}

function defaultValuesAreEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      (Object.is(a, b) || a.every((v, i) => defaultValuesAreEqual(v, b[i])))
    );
  }

  return Object.is(a, b);
}

/**
 * A hook that returns `state` and `actions` of a field atom from
 * `useFieldState` and `useFieldActions`.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseFieldOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 */
export function useField(fieldAtom, options) {
  const actions = useFieldActions(fieldAtom, options);
  const state = useFieldState(fieldAtom, options);
  useFieldInitialValue(fieldAtom, options?.initialValue, options);
  return React.useMemo(() => ({ actions, state }), [actions, state]);
}

/**
 * A hook that returns `props`, `state`, and `actions` of a field atom from
 * `useInputFieldProps`, `useFieldState`, and `useFieldActions`.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseInputFieldOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 */
export function useInputField(fieldAtom, options) {
  const props = useInputFieldProps(fieldAtom, options);
  return _useField(fieldAtom, props, options);
}

/**
 * A hook that returns `props`, `state`, and `actions` of a field atom from
 * `useInputFieldProps`, `useFieldState`, and `useFieldActions`.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseInputFieldOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 */
export function useSelectField(fieldAtom, options) {
  const props = useSelectFieldProps(fieldAtom, options);
  // @ts-expect-error: it's fine
  return _useField(fieldAtom, props, options);
}

/**
 * A hook that returns `props`, `state`, and `actions` of a field atom from
 * `useTextareaFieldProps`, `useFieldState`, and `useFieldActions`.
 *
 * @param {FieldAtom<any>} fieldAtom - The atom that stores the field's state.
 * @param {UseTextareaFieldOptions} options - Options to pass to the underlying `useAtomValue`
 *  and `useSetAtom` hooks.
 */
export function useTextareaField(fieldAtom, options) {
  const props = useTextareaFieldProps(fieldAtom, options);
  return _useField(fieldAtom, props, options);
}

function _useField(fieldAtom, props, options) {
  const field = useField(fieldAtom, options);
  useFieldInitialValue(fieldAtom, options?.initialValue, options);
  return React.useMemo(() => ({ props, ...field }), [props, field]);
}

const useTransition =
  typeof React.useTransition === 'function' ? React.useTransition : () => [false, (fn) => fn()];

function isPromise(value) {
  return typeof value === 'object' && typeof value.then === 'function';
}

function isAtom(maybeAtom) {
  return (
    maybeAtom !== null &&
    typeof maybeAtom === 'object' &&
    (typeof maybeAtom.read === 'function' || typeof maybeAtom.write === 'function')
  );
}

export {
  /**
   * Reset an atom to its initial value.
   */
  RESET,
};

export function walkFields(fields, visitor, options = {}, path = []) {
    for (const key in fields) {
        path.push(key)
        const field = fields[key]

        if (isAtom(field)) {
            if (visitor(field, path) === false) return
        } else if (Array.isArray(field)) {
            if (!field.length && options.includeEmptyArrays) {
                // @ts-expect-error: it's fine for now
                visitor(null, path)
            } else {
                for (const key in field) {
                    path.push(key)
                    const subField = field[key]

                    if (isAtom(subField)) {
                        if (visitor(subField, path) === false) return
                    } else {
                        walkFields(subField, visitor, options, path)
                    }

                    path.pop()
                }
            }
        } else if (typeof field === "object") {
            walkFields(field, visitor, options, path)
        }

        path.pop()
    }
}
