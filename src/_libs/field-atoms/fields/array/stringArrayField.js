import { z } from 'zod';

import { arrayField } from './arrayField';

const elementSchema = z.string();

export const stringArrayField = (params = {}) => arrayField({ elementSchema, ...params });
