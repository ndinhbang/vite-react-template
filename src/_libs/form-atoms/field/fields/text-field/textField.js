import { z } from 'zod';

import { zodField } from '..';
import { defaultParams } from '../zod-field/zodParams';

export const textField = ({
  required_error = defaultParams.required_error,
  value = '',
  ...config
} = {}) =>
  zodField({
    value,
    // https://github.com/colinhacks/zod/issues/63
    schema: z.string().trim().min(1, required_error),
    optionalSchema: z.string().trim(),
    ...config,
  });
