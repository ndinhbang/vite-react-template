import { useMemo } from 'react';

export function useOptions({ field, getLabel, options }) {
  return useMemo(
    () => ({
      renderOptions: options.map((option, index) => {
        return {
          id: `${field}/${index}`,
          value: index,
          label: getLabel(option),
        };
      }),
    }),
    [options, field, getLabel],
  );
}
