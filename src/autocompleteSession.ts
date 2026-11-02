import { Platform } from "react-native";

import type {
  RadarAddress,
  RadarAddressCallback,
  RadarAutocompleteOptions,
  RadarAutocompleteSelectCallback,
} from "./@types/types";

/** v4 UUID, from crypto where available and Math.random otherwise */
const generateUUID = (): string =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  /** the token this session sends */
  public readonly sessionToken: string;

  /**
   * @param sessionToken resumes a session from a token minted elsewhere; omit it to mint a new one.
   * @throws if `sessionToken` is given and is not a UUID
   */
  constructor(sessionToken?: string) {
    if (sessionToken !== undefined && !UUID_PATTERN.test(sessionToken)) {
      throw new Error("sessionToken: must be a UUID.");
    }

    this.sessionToken = sessionToken ?? generateUUID();
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
  public select(address: RadarAddress): Promise<RadarAutocompleteSelectCallback> {
    return platformModule().selectAutocompleteAddress({ address });
  }
}

export default AutocompleteSession;
