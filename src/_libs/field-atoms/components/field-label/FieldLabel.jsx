import { useCallback } from 'react';

/**
 * Renders an accessible label controlling the field's input.
 * @deprecated The atomKey is not suitable for input/label pairing as it does not support SSR. Moreover the onMouseDown is UX feature, not a logic concern for a field.
 */
export const FieldLabel = ({ field, label, children = (props) => <label {...props} /> }) => {
  const onMouseDown = useCallback((event) => {
    // prevent text selection when double clicking label
    if (!event.defaultPrevented) {
      event.preventDefault();
    }
  }, []);

  return children({
    htmlFor: `${field}`,
    onMouseDown,
    children: label,
  });
};
