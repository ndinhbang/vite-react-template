import { z } from 'zod';

import { zodField } from '..';
import { defaultParams } from '../zod/zodParams';

export const dateField = ({ required_error = defaultParams.required_error, ...config } = {}) =>
  zodField({
    value: undefined,
    schema: z.date({ required_error }),
    ...config,
  });
