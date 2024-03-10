import { formAtom, walkFields } from 'form-atoms';
import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';

import { extendAtom } from '../extendAtom';

export function listItemForm({ fields, formListAtom, getListNameAtom }) {
  const itemFormAtom = extendAtom(formAtom(fields), (base, get) => {
    const nameAtom = atom((get) => {
      const list = get(formListAtom);
      const listName = get(getListNameAtom(get));

      return `${listName ?? ''}[${list.indexOf(itemFormAtom)}]`;
    });

    const patchNamesEffect = atomEffect((get, set) => {
      const fields = get(base.fields);

      walkFields(fields, (field) => {
        const { name: _originalNameAtom, ...atoms } = get(field);

        const scopedNameAtom = atom(
          (get) => {
            return [get(nameAtom), get(_originalNameAtom)].filter(Boolean).join('.');
          },
          (_, set, update) => {
            set(_originalNameAtom, update);
          },
        );

        if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
          scopedNameAtom.debugLabel = _originalNameAtom.debugLabel + '/scoped';
        }

        // @ts-expect-error field is PrimitiveAtom
        set(field, { ...atoms, name: scopedNameAtom, _originalNameAtom });
      });

      return () => {
        walkFields(fields, (field) => {
          // @ts-expect-error oh yes
          const { _originalNameAtom, ...atoms } = get(field);

          // @ts-expect-error field is PrimitiveAtom
          set(field, {
            ...atoms,
            // drop the scopedNameAtom, as to not make it original on next mount
            name: _originalNameAtom,
            _originalNameAtom: undefined,
          });
        });
      };
    });

    get(patchNamesEffect);

    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      patchNamesEffect.debugPrivate = true;
      nameAtom.debugPrivate = true;
    }

    return {
      name: nameAtom,
    };
  });

  return itemFormAtom;
}
