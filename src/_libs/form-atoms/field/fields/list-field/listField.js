import { listAtom } from '@form-atoms/list-atom';
import { z } from 'zod';

import { extendAtom } from '../../atoms/extendAtom';
import { schemaValidate } from '../../atoms/schemaValidate';
import { defaultParams } from '../zod-field';

export const listField = ({
  required_error = defaultParams.required_error,
  schema,
  optionalSchema,
  ...config
}) => {
  const { validate, requiredAtom, makeOptional } = schemaValidate({
    schema: schema ?? z.array(z.any()).nonempty(required_error),
    optionalSchema: optionalSchema ?? z.array(z.any()),
  });

  const listFieldAtom = extendAtom(listAtom({ ...config, validate }), () => ({
    required: requiredAtom,
  }));

  listFieldAtom.optional = (readRequired = () => false) => {
    const { validate, requiredAtom } = makeOptional(readRequired);

    const optionalZodFieldAtom = extendAtom(listAtom({ ...config, validate }), () => ({
      required: requiredAtom,
    }));

    optionalZodFieldAtom.optional = () => optionalZodFieldAtom;

    return optionalZodFieldAtom;
  };

  return listFieldAtom;
};
