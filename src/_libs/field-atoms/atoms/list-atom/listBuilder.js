// actual type must be one of overloads, as this one is ignored
export function listBuilder(builder) {
  let emptyValue = undefined;
  try {
    // test if builder is 'atomBuilder', e.g. returns plain atom
    // @ts-expect-error this is a test call
    builder(undefined);
  } catch {
    // builder is 'fieldsBuilder', e.g. it returns Record<string, fieldAtom>
    emptyValue = {};
  }

  function buildFields(data) {
    if (data) {
      return data.map(builder);
    } else {
      // @ts-expect-error empty call
      return builder(emptyValue);
    }
  }

  return buildFields;
}
