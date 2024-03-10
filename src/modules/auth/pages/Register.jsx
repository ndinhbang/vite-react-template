import { fieldAtom, FieldLabel, InputField, List, listAtom } from '@lib/form-atoms';

const Register = () => {
  return (
    <div>
      <NestedListExample />
    </div>
  );
};

const users = listAtom({
  name: 'users',
  value: [
    {
      name: 'Jerry',
      lastName: 'Park',
      accounts: [{ iban: 'SK89 7500 0000 0000 1234 5671' }],
    },
  ],
  fields: ({ name, lastName, accounts = [] }) => ({
    name: fieldAtom({ value: name }),
    lastName: fieldAtom({ value: lastName }),
    accounts: listAtom({
      name: 'accounts',
      value: accounts,
      fields: ({ iban }) => ({ iban: fieldAtom({ value: iban }) }),
    }),
  }),
});

const NestedListExample = () => {
  return (
    <List atom={users}>
      {({ fields, index, remove }) => (
        <article>
          <header>
            <nav>
              <ul>
                <li>
                  <strong>Person #{index + 1}</strong>
                </li>
              </ul>
              <ul>
                <li>
                  <a
                    href='#'
                    role='button'
                    className='outline secondary'
                    onClick={(e) => {
                      e.preventDefault();
                      remove();
                    }}
                  >
                    Remove
                  </a>
                </li>
              </ul>
            </nav>
          </header>
          <div className='grid'>
            <div>
              <FieldLabel
                field={fields.name}
                label='First Name'
              />
              <InputField
                atom={fields.name}
                render={(props) => (
                  <input
                    {...props}
                    placeholder='Name'
                  />
                )}
              />
            </div>
            <div>
              <FieldLabel
                field={fields.lastName}
                label='Last Name'
              />
              <InputField
                atom={fields.lastName}
                render={(props) => (
                  <input
                    {...props}
                    placeholder='Last Name'
                  />
                )}
              />
            </div>
          </div>
          <List atom={fields.accounts}>
            {({ fields, index, RemoveButton: RemoveIban }) => (
              <>
                <label>Account #{index + 1}</label>
                <div
                  style={{
                    display: 'grid',
                    gridGap: 16,
                    gridTemplateColumns: 'auto min-content',
                  }}
                >
                  <InputField
                    atom={fields.iban}
                    render={(props) => (
                      <input
                        {...props}
                        placeholder='IBAN'
                      />
                    )}
                  />
                  <RemoveIban />
                </div>
              </>
            )}
          </List>
        </article>
      )}
    </List>
  );
};

const RemoveButton = ({ remove }) => (
  <button
    type='button'
    className='outline secondary'
    onClick={remove}
  >
    Remove
  </button>
);
export default Register;
