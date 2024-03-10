import {ZodError, ZodType} from 'zod';

/**
 * Validate your field atoms with Zod schemas. This function validates
 * on every "user" and "submit" event, in addition to other events you specify.
 *
 * @param schema - Zod schema or a function that returns a Zod schema
 * @param config - Configuration options
 * @example
 * ```ts
 * const schema = z.object({
 *  name: z.string().min(3),
 * });
 *
 * const nameForm = formAtom({
 *   name: fieldAtom({
 *     validate: zodValidate(schema.shape.name, {
 *       on: "blur",
 *       when: "dirty",
 *     })
 *   })
 * })
 * ```
 */
export function zodValidate(schema, config = {}) {
  const { on, when, formatError = (err) => err.flatten().formErrors } = config;
  const ors = [];
  const ifDirty = !!when?.includes('dirty');
  const ifTouched = !!when?.includes('touched');

  const chain = Object.assign(
    async (state) => {
      let result;
      const shouldHandleEvent =
        state.event === 'user' || state.event === 'submit' || !!on?.includes(state.event);

      if (shouldHandleEvent) {
        if (when === undefined || (ifDirty && state.dirty) || (ifTouched && state.touched)) {
          const validator = schema instanceof ZodType ? schema : schema(state.get);

          try {
            await validator.parseAsync(state.value);
            result = [];
          } catch (err) {
            if (err instanceof ZodError) {
              return formatError(err);
            }

            throw err;
          }
        }
      }

      if (ors.length > 0) {
        for (const or of ors) {
          const errors = await or(state);

          if (errors?.length) {
            result = result ? result.concat(errors) : errors;
          } else if (errors) {
            result = result ? result.concat(errors) : errors;
          }

          if (result) {
            return result;
          }
        }
      }

      return result;
    },
    {
      or(config) {
        const or = zodValidate(schema, { formatError, ...config });
        ors.push(or);
        return chain;
      },
    },
  );

  return chain;
}
