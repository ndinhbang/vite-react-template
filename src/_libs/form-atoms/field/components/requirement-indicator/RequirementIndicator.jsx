import {useAtomValue} from 'jotai';

/**
 * Indicates field's required state by using the useRequiredProps() hook.
 */
export const RequirementIndicator = ({ kind = 'icon', field }) => {
  const atom = useAtomValue(field);
  const isFieldRequired = useAtomValue(atom.required);

  const requiredIndicator = kind === 'icon' ? '*' : '(required)'; // TODO: i18n
  const opitonalIndicator = kind === 'icon' ? '' : '(optional)';

  return <span aria-hidden='true'>{isFieldRequired ? requiredIndicator : opitonalIndicator}</span>;
};
