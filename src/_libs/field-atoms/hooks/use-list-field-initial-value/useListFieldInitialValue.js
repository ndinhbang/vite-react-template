import { _useFieldInitialValue } from '../../atoms';
import { useHydrateField } from '../use-hydrate-field';

export function useListFieldInitialValue(fieldAtom, initialValue, options) {
  useHydrateField(fieldAtom, initialValue);
  _useFieldInitialValue(fieldAtom, initialValue, options);
}
