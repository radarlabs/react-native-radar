const NativeModules = require('react-native').NativeModules;

import { AutocompleteSession } from '../src/autocompleteSession.ts';

const mockModule = NativeModules.RNRadar;

const TOKEN = 'ffbcb2ca-1d1c-4f96-9b91-fd0b0b0e1b7f';

describe('AutocompleteSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockModule.autocomplete.mockResolvedValue({
      status: 'SUCCESS',
      addresses: [],
      sessionToken: TOKEN,
    });
  });

  test('has no token until the first call returns one', async () => {
    const session = new AutocompleteSession();

    expect(session.sessionToken).toBeUndefined();

    await session.autocomplete({ query: '841 bro', limit: 10 });

    expect(session.sessionToken).toEqual(TOKEN);
  });

  test('opens the session without sending a token', async () => {
    await new AutocompleteSession().autocomplete({ query: '841 bro', limit: 10 });

    expect(mockModule.autocomplete).toBeCalledWith({ query: '841 bro', limit: 10 });
  });

  test('sends the minted token on later calls', async () => {
    const session = new AutocompleteSession();

    await session.autocomplete({ query: '841', limit: 10 });
    await session.autocomplete({ query: '841 bro', limit: 10 });

    expect(mockModule.autocomplete).toHaveBeenLastCalledWith({
      query: '841 bro',
      limit: 10,
      sessionToken: TOKEN,
    });
  });

  test('concurrent first calls open only one session', async () => {
    const session = new AutocompleteSession();

    // autocomplete fires per keystroke, so two can race before either has returned a token
    await Promise.all([
      session.autocomplete({ query: '8', limit: 10 }),
      session.autocomplete({ query: '84', limit: 10 }),
    ]);

    const opened = mockModule.autocomplete.mock.calls.filter(
      ([options]) => options.sessionToken === undefined,
    );
    expect(opened).toHaveLength(1);
  });

  test('keeps working when the native side returns no token', async () => {
    mockModule.autocomplete.mockResolvedValue({ status: 'SUCCESS', addresses: [] });
    const session = new AutocompleteSession();

    const result = await session.autocomplete({ query: '841 bro', limit: 10 });

    expect(result.status).toEqual('SUCCESS');
    expect(session.sessionToken).toBeUndefined();
  });

  test('selects by passing the address back', () => {
    const address = { formattedAddress: '841 Broadway', resultId: 'v1_abc' };

    new AutocompleteSession().select(address);

    expect(mockModule.selectAutocompleteAddress).toBeCalledWith({ address });
  });
});
