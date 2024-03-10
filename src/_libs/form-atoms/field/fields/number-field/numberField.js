import { z } from 'zod';

import { zodField } from '..';
import { defaultParams } from '../zod-field/zodParams';

export const numberField = ({ required_error = defaultParams.required_error, ...config } = {}) =>
  zodField({
    value: undefined,
    schema: z.number({ required_error }),
    ...config,
  });
