import { extendAtom } from '@form-atoms/list-atom';
import { fieldAtom } from 'form-atoms';
import { atom } from 'jotai';

export const uploadAtom = (upload) => (file, config) => {
  const requestAtom = atom(async () => upload(file));

  const field = fieldAtom({
    ...config,
    value: undefined,
    validate: async ({ get, set, value }) => {
      if (value) {
        // the file was already uploaded, the value is the response
        return [];
      }

      try {
        const result = await get(requestAtom);

        set(get(field).value, result);

        return [];
      } catch (err) {
        if (typeof err !== 'string') {
          console.warn('uploadAtom: The error thrown from failed upload is not a string.');
          return ['Failed to upload!'];
        } else {
          return [err];
        }
      }
    },
  });

  // @ts-expect-error field IS primitive atom
  return extendAtom(field, ({ validateStatus }) => ({
    uploadStatus: atom((get) => {
      const status = get(validateStatus);

      if (status === 'validating') {
        return 'loading';
      } else if (status === 'valid') {
        return 'success';
      } else {
        return 'error';
      }
    }),
  }));
};
