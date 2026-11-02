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
 * Create one session per address field.
 */
export class AutocompleteSession {
  private token?: string;

  /** in flight while the first call establishes the token */
  private opening?: Promise<RadarAddressCallback>;

  /** the token this session sends, once the first autocomplete has returned it */
  public get sessionToken(): string | undefined {
    return this.token;
  }

  /**
   * autocomplete partial addresses and place names within this session
   * @returns matching addresses, each selectable via {@link AutocompleteSession.select}
   */
  public async autocomplete(
    options: Omit<RadarAutocompleteOptions, "sessionToken">,
  ): Promise<RadarAddressCallback> {
    // The native side mints the token. Hold concurrent first calls behind the one that opens the
    // session, or each would open its own and the field would be split across several.
    if (this.token === undefined && this.opening) {
      await this.opening.catch(() => undefined);
    }

    const call = platformModule().autocomplete(
      this.token === undefined ? options : { ...options, sessionToken: this.token },
    ) as Promise<RadarAddressCallback>;

    if (this.token === undefined) {
      this.opening = call;
    }

    const result = await call;
    if (this.token === undefined && result?.sessionToken) {
      this.token = result.sessionToken;
    }

    return result;
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
