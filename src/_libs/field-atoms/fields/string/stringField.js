import { z } from 'zod';

import { zodField } from '..';
import { defaultParams } from '../zod/zodParams';

export const stringField = ({ required_error = defaultParams.required_error, ...config } = {}) =>
  zodField({
    value: undefined,
    schema: z.string({ required_error }),
    ...config,
  });
