import { Platform } from "react-native";

import type { Spec } from "./NativeRadar";
import type {
  RadarAddress,
  RadarAddressCallback,
  RadarAutocompleteOptions,
  RadarAutocompleteSelectCallback,
} from "./@types/types";

// Lazy: the TurboModule cannot load on web.
const nativeRadar = (): Spec => require("./NativeRadar").default;

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
    if (Platform.OS === "web") {
      throw new Error("AutocompleteSession is not supported on web");
    }

    const sessionToken = await nativeRadar().createAutocompleteSessionToken();

    return new AutocompleteSession(sessionToken);
  }

  /**
   * autocomplete partial addresses and place names within this session
   * @returns matching addresses, each selectable via {@link AutocompleteSession.select}
   */
  public autocomplete(
    options: Omit<RadarAutocompleteOptions, "sessionToken">,
  ): Promise<RadarAddressCallback> {
    return nativeRadar().autocomplete({
      ...options,
      sessionToken: this.sessionToken,
    }) as Promise<RadarAddressCallback>;
  }

  /**
   * report which result the user chose
   * @param address the selected result, as returned by {@link AutocompleteSession.autocomplete}
   * @returns the enriched address, where available
   */
  public select(
    address: RadarAddress,
  ): Promise<RadarAutocompleteSelectCallback> {
    return nativeRadar().selectAutocompleteAddress({
      address,
    }) as Promise<RadarAutocompleteSelectCallback>;
  }
}

export default AutocompleteSession;
