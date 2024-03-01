import { z } from 'zod';

import { defaultParams, zodField } from '../zod';

export const arrayField = ({
  required_error = defaultParams.required_error,
  value = [],
  elementSchema,
  ...config
}) =>
  zodField({
    value,
    schema: z.array(elementSchema).nonempty(required_error),
    optionalSchema: z.array(elementSchema),
    ...config,
  });
