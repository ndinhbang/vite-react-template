import { z } from 'zod';

import { zodField } from '..';
import { defaultParams } from '../zod-field/zodParams';

export const booleanField = ({ required_error = defaultParams.required_error, ...config } = {}) =>
  zodField({
    value: undefined,
    schema: z.boolean({ required_error }),
    ...config,
  });
