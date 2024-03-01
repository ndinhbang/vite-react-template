import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export function FileUpload({ field, children }) {
  const atoms = useAtomValue(field);
  const validate = useSetAtom(atoms.validate);
  const status = useAtomValue(atoms.uploadStatus);

  // runs the upload
  useEffect(() => validate(), []);

  return children({
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
  });
}
