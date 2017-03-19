package com.onradar.react;

import android.content.Context;
import android.support.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.onradar.sdk.Radar;
import com.onradar.sdk.RadarReceiver;
import com.onradar.sdk.model.RadarEvent;
import com.onradar.sdk.model.RadarUser;

public class RNRadarReceiver extends RadarReceiver {

    @Override
    public void onEventsReceived(@NonNull Context context, @NonNull RadarEvent[] events, @NonNull RadarUser user) {
        WritableMap map = Arguments.createMap();
        map.putArray("events", RNRadarUtils.arrayForEvents(events));
        map.putMap("user", RNRadarUtils.mapForUser(user));
        RNRadarEventEmitter.getSharedInstance().sendEvent("events", map);
    }

    @Override
    public void onError(@NonNull Context context, @NonNull Radar.RadarStatus status) {
        RNRadarEventEmitter.getSharedInstance().sendEvent("error", RNRadarUtils.stringForStatus(status));
    }

}
