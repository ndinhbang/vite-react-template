import { Fragment, useCallback } from 'react';
import { useList } from '../../hooks';

export function List({
  atom,
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
  const { add, isEmpty, items } = useList(atom, { initialValue });

  return (
    <>
      {isEmpty && Empty ? <Empty /> : undefined}
      {items.map(({ remove, fields, key, item, moveUp, moveDown }, index) => (
        <Fragment key={key}>
          {children({
            item,
            fields,
            add,
            remove,
            moveUp,
            moveDown,
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
