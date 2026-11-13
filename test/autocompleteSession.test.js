const NativeModules = require('react-native').NativeModules;

import { AutocompleteSession } from '../src/autocompleteSession.ts';

const mockModule = NativeModules.RNRadar;

const TOKEN = 'ffbcb2ca-1d1c-4f96-9b91-fd0b0b0e1b7f';

describe('AutocompleteSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockModule.createAutocompleteSessionToken.mockResolvedValue(TOKEN);
    mockModule.autocomplete.mockResolvedValue({ status: 'SUCCESS', addresses: [] });
  });

  test('opens with a natively minted token', async () => {
    const session = await AutocompleteSession.create();

    expect(mockModule.createAutocompleteSessionToken).toBeCalledTimes(1);
    expect(session.sessionToken).toEqual(TOKEN);
  });

  test('sends its token on every call, including the first', async () => {
    const session = await AutocompleteSession.create();

    await session.autocomplete({ query: '841', limit: 10 });
    await session.autocomplete({ query: '841 bro', limit: 10 });

    for (const [options] of mockModule.autocomplete.mock.calls) {
      expect(options.sessionToken).toEqual(TOKEN);
    }
  });

  test('concurrent calls share the one token', async () => {
    // autocomplete fires per keystroke; the token exists before any of them run
    const session = await AutocompleteSession.create();

    await Promise.all([
      session.autocomplete({ query: '8', limit: 10 }),
      session.autocomplete({ query: '84', limit: 10 }),
    ]);

    expect(mockModule.createAutocompleteSessionToken).toBeCalledTimes(1);
    const tokens = mockModule.autocomplete.mock.calls.map(([o]) => o.sessionToken);
    expect(new Set(tokens).size).toEqual(1);
  });

  test('gives each session its own token', async () => {
    mockModule.createAutocompleteSessionToken
      .mockResolvedValueOnce('aaaaaaaa-1d1c-4f96-9b91-fd0b0b0e1b7f')
      .mockResolvedValueOnce('bbbbbbbb-1d1c-4f96-9b91-fd0b0b0e1b7f');

    const billing = await AutocompleteSession.create();
    const shipping = await AutocompleteSession.create();

    expect(billing.sessionToken).not.toEqual(shipping.sessionToken);
  });

  test('selects by passing the address back', async () => {
    const session = await AutocompleteSession.create();
    const address = { formattedAddress: '841 Broadway', resultId: 'v1_abc' };

    session.select(address);

    expect(mockModule.selectAutocompleteAddress).toBeCalledWith({ address });
  });
});
