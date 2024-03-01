import { z } from 'zod';

import { zodField } from '..';
import { defaultParams } from '../zod/zodParams';

export const checkboxField = ({
  required_error = defaultParams.required_error,
  value = false,
  ...config
} = {}) =>
  zodField({
    value,
    /**
     * When checkbox is required, it must be checked, so the value must be true.
     */
    schema: z.literal(true, {
      errorMap: (issue) => {
        return issue.code === 'invalid_literal'
          ? { message: required_error }
          : { message: issue.message ?? 'Invalid' };
      },
    }),
    optionalSchema: z.boolean(),
    ...config,
  });
