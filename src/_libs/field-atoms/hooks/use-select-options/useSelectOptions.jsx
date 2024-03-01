import { useMemo } from 'react';

import { useOptions } from '../use-options';

export function useSelectOptions(props) {
  const { renderOptions } = useOptions(props);

  return useMemo(
    () => ({
      selectOptions: (
        <>
          {renderOptions.map(({ id, value, label }) => (
            <option
              key={id}
              value={value}
            >
              {label}
            </option>
          ))}
        </>
      ),
    }),
    [renderOptions],
  );
}
