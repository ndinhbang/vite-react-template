import {zodValidate} from 'form-atoms/zod';
import {atom} from 'jotai';
import {atomWithDefault} from 'jotai/utils';

/**
 * Read-only atom for default zodFields which all are required.
 */
const defaultRequiredAtom = atom(() => true);
defaultRequiredAtom.debugLabel = 'zodField/defaultRequired';

export function schemaValidate({ schema, optionalSchema }) {
  const validate = zodValidate(
    (get) => {
      return typeof schema === 'function' ? schema(get) : schema;
    },
    {
      on: 'blur',
      when: 'dirty',
    },
  ).or({ on: 'change', when: 'touched' });

  const makeOptional = (readRequired = () => false) => {
    const requiredAtom = atomWithDefault(readRequired);
    const validate = zodValidate(
      (get) => {
        const schemaObj = typeof schema === 'function' ? schema(get) : schema;

        const optionalSchemaObj =
          typeof optionalSchema === 'function' ? optionalSchema(get) : optionalSchema;

        const optSchema = optionalSchemaObj ?? schemaObj.optional();

        const isRequired = get(requiredAtom);

        return isRequired ? schemaObj : optSchema;
      },
      {
        on: 'blur',
        when: 'dirty',
      },
    ).or({ on: 'change', when: 'touched' });

    return { validate, requiredAtom };
  };

  return { validate, requiredAtom: defaultRequiredAtom, makeOptional };
}
