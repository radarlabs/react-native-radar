package io.radar.react;

import android.content.Context;

import io.radar.sdk.Radar;

/**
 * Utility for initializing the Radar SDK with the {@link io.radar.sdk.RadarReceiver React Native Receiver}.
 */
@SuppressWarnings("unused")
public class RNRadar {

    /**
     * Initializes the Radar SDK. Call this method from the main thread in your Application class before calling any
     * other Radar methods.
     *
     * @param context Application context
     * @param publishableKey Your publishable API key
     * @see <a href="https://radar.io/documentation/sdk/react-native#install">
     * Radar React Native SDK Reference
     * </a>
     */
    public static void initialize(Context context, String publishableKey) {
        Radar.initialize(context, publishableKey, new RNRadarReceiver());
    }

}
