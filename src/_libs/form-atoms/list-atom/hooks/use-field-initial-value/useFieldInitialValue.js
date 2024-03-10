import { _useFieldInitialValue } from './_useFieldInitialValue';
import { useHydrateField } from '../use-hydrate-field';

export function useFieldInitialValue(fieldAtom, initialValue, options) {
  useHydrateField(fieldAtom, initialValue);
  _useFieldInitialValue(fieldAtom, initialValue, options);
}
