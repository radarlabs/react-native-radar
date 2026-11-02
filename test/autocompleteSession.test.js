const NativeModules = require('react-native').NativeModules;

import { AutocompleteSession } from '../src/autocompleteSession.ts';

const mockModule = NativeModules.RNRadar;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('AutocompleteSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('mints its own token', () => {
    expect(new AutocompleteSession().sessionToken).toMatch(UUID_PATTERN);
  });

  test('gives each session a distinct token', () => {
    const billing = new AutocompleteSession();
    const shipping = new AutocompleteSession();

    expect(billing.sessionToken).not.toEqual(shipping.sessionToken);
  });

  test('resumes a session from a token minted elsewhere', () => {
    const token = 'ffbcb2ca-1d1c-4f96-9b91-fd0b0b0e1b7f';

    expect(new AutocompleteSession(token).sessionToken).toEqual(token);
  });

  test('refuses a resumed token that is not a UUID', () => {
    for (const bad of ['not-a-uuid', '', '1-1-1-1-1']) {
      expect(() => new AutocompleteSession(bad)).toThrow();
    }
  });

  test('sends its token on autocomplete', () => {
    const session = new AutocompleteSession();

    session.autocomplete({ query: '841 bro', limit: 10 });

    expect(mockModule.autocomplete).toBeCalledWith({
      query: '841 bro',
      limit: 10,
      sessionToken: session.sessionToken,
    });
  });

  test('reuses one token across calls', () => {
    const session = new AutocompleteSession();

    session.autocomplete({ query: '841', limit: 10 });
    session.autocomplete({ query: '841 bro', limit: 10 });

    const [first, second] = mockModule.autocomplete.mock.calls;
    expect(first[0].sessionToken).toEqual(second[0].sessionToken);
  });

  test('selects by passing the address back', () => {
    const session = new AutocompleteSession();
    const address = { formattedAddress: '841 Broadway', resultId: 'v1_abc' };

    session.select(address);

    expect(mockModule.selectAutocompleteAddress).toBeCalledWith({ address });
  });
});
