package com.onradar.react;

import android.location.Location;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.onradar.sdk.Radar;
import com.onradar.sdk.model.RadarEvent;
import com.onradar.sdk.model.RadarGeofence;
import com.onradar.sdk.model.RadarUser;

class RNRadarUtils {

    static String stringForPermissionsStatus(boolean hasGrantedPermissions) {
        if (hasGrantedPermissions)
            return "GRANTED";
        return "DENIED";
    }

    static String stringForStatus(Radar.RadarStatus status) {
        return status.toString();
    }

    static WritableMap mapForUser(RadarUser user) {
        if (user == null)
            return null;

        WritableMap map = Arguments.createMap();
        map.putString("_id", user.getId());
        map.putString("userId", user.getUserId());
        String description = user.getDescription();
        if (description != null)
            map.putString("description", description);
        WritableArray geofencesArr = Arguments.createArray();
        for (RadarGeofence geofence : user.getGeofences()) {
            WritableMap geofenceMap = RNRadarUtils.mapForGeofence(geofence);
            geofencesArr.pushMap(geofenceMap);
        }
        map.putArray("geofences", geofencesArr);
        return map;
    }

    private static WritableMap mapForGeofence(RadarGeofence geofence) {
        if (geofence == null)
            return null;

        WritableMap map = Arguments.createMap();
        map.putString("_id", geofence.getId());
        String tag = geofence.getTag();
        if (tag != null)
            map.putString("tag", tag);
        String externalId = geofence.getExternalId();
        if (externalId != null)
            map.putString("externalId", externalId);
        map.putString("description", geofence.getDescription());
        return map;
    }

    static WritableArray arrayForEvents(RadarEvent[] events) {
        if (events == null)
            return null;

        WritableArray arr = Arguments.createArray();
        for (RadarEvent event : events) {
            WritableMap map = RNRadarUtils.mapForEvent(event);
            arr.pushMap(map);
        }
        return arr;
    }

    private static WritableMap mapForEvent(RadarEvent event) {
        if (event == null)
            return null;

        WritableMap map = Arguments.createMap();
        map.putString("_id", event.getId());
        map.putBoolean("live", event.getLive());
        map.putString("type", event.getType() == RadarEvent.RadarEventType.USER_ENTERED_GEOFENCE ? "user.entered_geofence" : "user.exited_geofence");
        WritableMap geofenceMap = RNRadarUtils.mapForGeofence(event.getGeofence());
        map.putMap("geofence", geofenceMap);
        int confidence;
        if (event.getConfidence() == RadarEvent.RadarEventConfidence.HIGH)
            confidence = 3;
        else if (event.getConfidence() == RadarEvent.RadarEventConfidence.MEDIUM)
            confidence = 2;
        else if (event.getConfidence() == RadarEvent.RadarEventConfidence.LOW)
            confidence = 1;
        else
            confidence = 0;
        map.putInt("confidence", confidence);
        map.putDouble("duration", event.getDuration());
        return map;
    }

    static WritableMap mapForLocation(Location location) {
        if (location == null)
            return null;

        WritableMap map = Arguments.createMap();
        map.putDouble("latitude", location.getLatitude());
        map.putDouble("longitude", location.getLongitude());
        map.putDouble("accuracy", location.getAccuracy());
        return map;
    }

}
