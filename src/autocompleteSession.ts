import { Platform } from "react-native";

import type {
  RadarAddress,
  RadarAddressCallback,
  RadarAutocompleteOptions,
  RadarAutocompleteSelectCallback,
} from "./@types/types";

const platformModule = () =>
  Platform.OS === "web"
    ? require("./index.web").default
    : require("./index.native").default;

/**
 * An autocomplete search field and the selection a user makes in it.
 *
 * Create one session per address field with {@link AutocompleteSession.create}.
 */
export class AutocompleteSession {
  /** the token this session sends */
  public readonly sessionToken: string;

  private constructor(sessionToken: string) {
    this.sessionToken = sessionToken;
  }

  /** opens a session. The token is minted natively, so this is async. */
  public static async create(): Promise<AutocompleteSession> {
    const sessionToken: string =
      await platformModule().createAutocompleteSessionToken();

    return new AutocompleteSession(sessionToken);
  }

  /**
   * autocomplete partial addresses and place names within this session
   * @returns matching addresses, each selectable via {@link AutocompleteSession.select}
   */
  public autocomplete(
    options: Omit<RadarAutocompleteOptions, "sessionToken">,
  ): Promise<RadarAddressCallback> {
    return platformModule().autocomplete({
      ...options,
      sessionToken: this.sessionToken,
    });
  }

  /**
   * report which result the user chose
   * @param address the selected result, as returned by {@link AutocompleteSession.autocomplete}
   * @returns the enriched address, where available
   */
  public select(
    address: RadarAddress,
  ): Promise<RadarAutocompleteSelectCallback> {
    return platformModule().selectAutocompleteAddress({ address });
  }
}

export default AutocompleteSession;
