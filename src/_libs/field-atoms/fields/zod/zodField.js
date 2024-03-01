import { fieldAtom } from 'form-atoms';

import { extendFieldAtom } from '../../atoms/extendFieldAtom';
import { schemaValidate } from '../../atoms/schemaValidate';

export function zodField({ schema, optionalSchema, nameAtom, ...config }) {
  const { validate, requiredAtom, makeOptional } = schemaValidate({
    schema,
    optionalSchema,
  });

  const zodFieldAtom = extendFieldAtom(fieldAtom({ ...config, validate }), () => ({
    required: requiredAtom,
    ...(nameAtom ? { name: nameAtom } : {}),
  }));

  zodFieldAtom.optional = (readRequired = () => false) => {
    const { validate, requiredAtom } = makeOptional(readRequired);

    const optionalZodFieldAtom = extendFieldAtom(fieldAtom({ ...config, validate }), () => ({
      required: requiredAtom,
      ...(nameAtom ? { name: nameAtom } : {}),
    }));

    optionalZodFieldAtom.optional = () => optionalZodFieldAtom;

    return optionalZodFieldAtom;
  };

  return zodFieldAtom;
}

// if (
//   typeof process !== "undefined" &&
//   process.env.NODE_ENV !== "production"
// ) {
//   Object.entries(fieldAtoms).map(([atomName, atom]) => {
//     atom.debugLabel = `field/${atomName}/${config.name ?? zodField}`;
//   });
// }
