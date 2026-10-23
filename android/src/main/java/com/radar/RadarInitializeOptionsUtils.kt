package com.radar

import com.facebook.react.bridge.ReadableMap
import io.radar.sdk.RadarInitializeOptions
import kotlin.time.DurationUnit
import kotlin.time.toDuration

object RadarInitializeOptionsUtils {

    // The Duration setters on RadarInitializeOptions.Builder are name-mangled by Kotlin
    // and can't be called from Java, so the old-arch module goes through this helper too.
    @JvmStatic
    fun applyOptions(builder: RadarInitializeOptions.Builder, options: ReadableMap?): RadarInitializeOptions.Builder {
        if (options == null) {
            return builder
        }
        if (options.hasKey("trackVerifiedAutoFailover") && !options.isNull("trackVerifiedAutoFailover")) {
            builder.trackVerifiedAutoFailover(options.getBoolean("trackVerifiedAutoFailover"))
        }
        if (options.hasKey("networkTimeoutInterval") && !options.isNull("networkTimeoutInterval")) {
            builder.networkTimeout(options.getDouble("networkTimeoutInterval").toDuration(DurationUnit.SECONDS))
        }
        if (options.hasKey("ipChangeDebounceInterval") && !options.isNull("ipChangeDebounceInterval")) {
            builder.ipChangeDebounceInterval(options.getDouble("ipChangeDebounceInterval").toDuration(DurationUnit.SECONDS))
        }
        return builder
    }
}
