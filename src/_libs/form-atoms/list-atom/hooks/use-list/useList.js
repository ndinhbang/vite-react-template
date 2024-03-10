import { useFieldInitialValue } from '../use-field-initial-value';
import { useListActions } from '../use-list-actions';
import { useListState } from '../use-list-state';

export const useList = (listAtom, options) => {
  useFieldInitialValue(listAtom, options?.initialValue, options);
  const { items: splitItems, formList, formFields, isEmpty } = useListState(listAtom, options);
  const { add, move, remove } = useListActions(listAtom, options);

  const items = splitItems.map((item, index) => ({
    item,
    key: `${formList[index]}`,
    fields: formFields[index],
    remove: () => remove(item),
    moveUp: () => move(item, splitItems[index - 1]),
    moveDown: () => move(item, item === splitItems.at(-1) ? splitItems[0] : splitItems[index + 2]),
  }));

  return { remove, add, move, isEmpty, items };
};
