import { z } from 'zod';

import { zodField } from '..';

const zodDigitSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
]);

export const digitField = ({ ...config } = {}) =>
  zodField({
    value: undefined,
    schema: zodDigitSchema,
    ...config,
  });
