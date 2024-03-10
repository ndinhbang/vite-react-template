import { useAtomValue } from 'jotai';

export function useIsUploadAtom(field) {
  const atoms = useAtomValue(field);

  return !!atoms.uploadStatus;
}

export const SwitchUploadAtom = ({ field, children }) => {
  if (useIsUploadAtom(field)) {
    return <>{children({ isUpload: true, field })}</>;
  } else {
    return <>{children({ isUpload: false, field })}</>;
  }
};
