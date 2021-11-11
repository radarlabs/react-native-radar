package io.radar.react;

import android.content.Context;

import io.radar.sdk.Radar;
import io.radar.sdk.RadarReceiver;

/**
 * Utility for initializing the Radar SDK with the {@link io.radar.sdk.RadarReceiver React Native Receiver}.
 *
 * If you use this class, or directly call {@link Radar#initialize(Context, String, RadarReceiver)}, be sure to set
 * the value of {@code ignore_radar_initialize_warning} in {@code bools.xml} to {@code true} so that you won't see
 * a warning when initializing Radar without setting the key in {@code strings.xml}.
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
