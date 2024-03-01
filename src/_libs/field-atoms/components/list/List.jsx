import { Fragment, useCallback } from 'react';
import { useListField } from '../../hooks';

export function List({
  field,
  initialValue,
  children,

  RemoveButton = ({ remove }) => (
    <button
      type='button'
      onClick={remove}
    >
      Remove
    </button>
  ),

  AddButton = ({ add }) => (
    <button
      type='button'
      onClick={() => add()}
    >
      Add item
    </button>
  ),

  Empty,
}) {
  const { add, isEmpty, items } = useListField(field, { initialValue });

  return (
    <>
      {isEmpty && Empty ? <Empty /> : undefined}
      {items.map(({ remove, fields, key, item, moveUp, moveDown }, index) => (
        <Fragment key={key}>
          {children({
            item,
            add,
            remove,
            moveUp,
            moveDown,
            fields,
            index,
            count: items.length,
            RemoveButton: () => <RemoveButton remove={remove} />,
          })}
        </Fragment>
      ))}
      <AddButton add={useCallback((fields) => add(undefined, fields), [add])} />
    </>
  );
}
