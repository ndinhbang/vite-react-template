import { formAtom, walkFields } from 'form-atoms';
import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';

import { extendFieldAtom } from '../extendFieldAtom';

// export type ListItemForm<Fields extends ListAtomItems> = ExtendFormAtom<
//   {
//     fields: Fields;
//   },
//   {
//     nameAtom: Atom<string>;
//   }
// >;

export function listItemForm({ fields, formListAtom, getListNameAtom }) {
  const itemFormAtom = extendFieldAtom(formAtom({ fields }), (base, get) => {
    const nameAtom = atom((get) => {
      const list = get(formListAtom);
      const listName = get(getListNameAtom(get));

      return `${listName ?? ''}[${list.indexOf(itemFormAtom)}]`;
    });

    const patchNamesEffect = atomEffect((get, set) => {
      const fields = get(base.fields);

      walkFields(fields, (field) => {
        const { name: originalFieldNameAtom } = get(field);

        const scopedNameAtom = atom(
          (get) => {
            return [get(nameAtom), get(originalFieldNameAtom)].filter(Boolean).join('.');
          },
          (_, set, update) => {
            set(originalFieldNameAtom, update);
          },
        );

        // @ts-expect-error field is PrimitiveAtom
        set(field, { name: scopedNameAtom, originalFieldNameAtom });
      });

      return () => {
        walkFields(fields, (field) => {
          // @ts-expect-error oh yes
          const { originalFieldNameAtom } = get(field);

          // @ts-expect-error field is PrimitiveAtom
          set(field, {
            // drop the scopedNameAtom, as to not make it original on next mount
            name: originalFieldNameAtom,
            originalFieldNameAtom: undefined,
          });
        });
      };
    });

    get(patchNamesEffect); // subscribe

    return {
      name: nameAtom,
    };
  });

  return itemFormAtom;
}
