package io.radar.react;

import android.location.Location;
import java.util.Iterator;
import org.json.JSONObject;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import io.radar.sdk.Radar;
import io.radar.sdk.RadarTrackingOptions;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarGeofence;
import io.radar.sdk.model.RadarPlace;
import io.radar.sdk.Radar.RadarTrackingOffline;
import io.radar.sdk.Radar.RadarTrackingSync;
import io.radar.sdk.model.RadarUser;
import io.radar.sdk.model.RadarUserInsights;
import io.radar.sdk.model.RadarUserInsightsLocation;
import io.radar.sdk.model.RadarUserInsightsState;

class RNRadarUtils {

    static String stringForPermissionsStatus(boolean hasGrantedPermissions) {
        if (hasGrantedPermissions) {
            return "GRANTED";
        }
        return "DENIED";
    }

    static String stringForStatus(Radar.RadarStatus status) {
        return status.toString();
    }

    static String stringForEventType(RadarEvent.RadarEventType type) {
        switch (type) {
            case USER_ENTERED_GEOFENCE:
                return "user.entered_geofence";
            case USER_EXITED_GEOFENCE:
                return "user.exited_geofence";
            case USER_ENTERED_HOME:
                return "user.entered_home";
            case USER_EXITED_HOME:
                return "user.exited_home";
            case USER_ENTERED_OFFICE:
                return "user.entered_office";
            case USER_EXITED_OFFICE:
                return "user.exited_office";
            case USER_STARTED_TRAVELING:
                return "user.started_traveling";
            case USER_STOPPED_TRAVELING:
                return "user.stopped_traveling";
            case USER_ENTERED_PLACE:
                return "user.entered_place";
            case USER_EXITED_PLACE:
                return "user.exited_place";
            case USER_NEARBY_PLACE_CHAIN:
                return "user.nearby_place_chain";
            default:
                return null;
        }
    }

    static int numberForEventConfidence(RadarEvent.RadarEventConfidence confidence) {
        switch (confidence) {
            case HIGH:
                return 3;
            case MEDIUM:
                return 2;
            case LOW:
                return 1;
            default:
                return 0;
        }
    }

    static String stringForUserInsightsLocationType(RadarUserInsightsLocation.RadarUserInsightsLocationType type) {
        switch (type) {
            case HOME:
                return "home";
            case OFFICE:
                return "office";
            default:
                return null;
        }
    }

    static int numberForUserInsightsLocationConfidence(RadarUserInsightsLocation.RadarUserInsightsLocationConfidence confidence) {
        switch (confidence) {
            case HIGH:
                return 3;
            case MEDIUM:
                return 2;
            case LOW:
                return 1;
            default:
                return 0;
        }
    }

    static Radar.RadarPlacesProvider placesProviderForString(String providerStr) {
        if (providerStr.equals("facebook")) {
            return Radar.RadarPlacesProvider.FACEBOOK;
        }
        return Radar.RadarPlacesProvider.NONE;
    }

    static WritableMap mapForJSONObject(JSONObject obj) {
        WritableMap map = Arguments.createMap();
        Iterator<String> keys = obj.keys();
        while(keys.hasNext()) {
            String key = keys.next();
            Object val = obj.opt(key);
            if (val instanceof String) {
                String valStr = (String) val;
                map.putString(key, valStr);
            } else if (val instanceof Number) {
                Number valNum = (Number) val;
                map.putDouble(key, valNum.doubleValue());
            } else if (val instanceof Boolean) {
                Boolean valBool = (Boolean) val;
                map.putBoolean(key, valBool);
            }
        }
        return map;
    }

    static WritableMap mapForUser(RadarUser user) {
        if (user == null) {
            return null;
        }

        WritableMap map = Arguments.createMap();
        map.putString("_id", user.getId());
        map.putString("userId", user.getUserId());
        String description = user.getDescription();
        if (description != null) {
            map.putString("description", description);
        }
        WritableArray geofencesArr = Arguments.createArray();
        for (RadarGeofence geofence : user.getGeofences()) {
            WritableMap geofenceMap = RNRadarUtils.mapForGeofence(geofence);
            if (geofenceMap != null) {
              geofencesArr.pushMap(geofenceMap);
            }
        }
        map.putArray("geofences", geofencesArr);
        WritableMap insightsMap = RNRadarUtils.mapForUserInsights(user.getInsights());
        if (insightsMap != null) {
            map.putMap("insights", insightsMap);
        }
        RadarPlace place = user.getPlace();
        if (place != null) {
          WritableMap placeMap = RNRadarUtils.mapForPlace(place);
          if (placeMap != null) {
              map.putMap("place", placeMap);
          }
        }
        return map;
    }

    private static WritableMap mapForUserInsights(RadarUserInsights insights) {
        if (insights == null) {
            return null;
        }

        WritableMap map = Arguments.createMap();
        WritableMap homeLocationMap = RNRadarUtils.mapForUserInsightsLocation(insights.getHomeLocation());
        if (homeLocationMap != null) {
            map.putMap("homeLocation", homeLocationMap);
        }
        WritableMap officeLocationMap = RNRadarUtils.mapForUserInsightsLocation(insights.getOfficeLocation());
        if (officeLocationMap != null) {
            map.putMap("officeLocation", officeLocationMap);
        }
        WritableMap stateMap = RNRadarUtils.mapForUserInsightsState(insights.getState());
        if (stateMap != null) {
            map.putMap("state", stateMap);
        }
        return map;
    }

    private static WritableMap mapForUserInsightsLocation(RadarUserInsightsLocation location) {
        if (location == null) {
            return null;
        }

        WritableMap map = Arguments.createMap();
        String type = RNRadarUtils.stringForUserInsightsLocationType(location.getType());
        if (type != null) {
            map.putString("type", type);
        }
        WritableMap locationMap = RNRadarUtils.mapForLocation(location.getLocation());
        if (locationMap != null) {
            map.putMap("location", locationMap);
        }
        int confidence = RNRadarUtils.numberForUserInsightsLocationConfidence(location.getConfidence());
        map.putInt("confidence", confidence);
        return map;
    }

    private static WritableMap mapForUserInsightsState(RadarUserInsightsState state) {
        if (state == null) {
            return null;
        }

        WritableMap map = Arguments.createMap();
        map.putBoolean("home", state.getHome());
        map.putBoolean("office", state.getOffice());
        map.putBoolean("traveling", state.getTraveling());
        return map;
    }

    private static WritableMap mapForGeofence(RadarGeofence geofence) {
        if (geofence == null) {
            return null;
        }

        WritableMap map = Arguments.createMap();
        map.putString("_id", geofence.getId());
        String tag = geofence.getTag();
        if (tag != null) {
            map.putString("tag", tag);
        }
        String externalId = geofence.getExternalId();
        if (externalId != null) {
            map.putString("externalId", externalId);
        }
        map.putString("description", geofence.getDescription());
        JSONObject metadataObj = geofence.getMetadata();
        if (metadataObj != null) {
            WritableMap metadata = RNRadarUtils.mapForJSONObject(metadataObj);
            map.putMap("metadata", metadata);
        }
        return map;
    }

    private static WritableMap mapForPlace(RadarPlace place) {
        if (place == null) {
            return null;
        }

        WritableMap map = Arguments.createMap();
        map.putString("_id", place.getId());
        String facebookId = place.getFacebookId();
        if (facebookId != null) {
            map.putString("facebookId", facebookId);
        }
        map.putString("name", place.getName());
        if (place.getCategories() != null && place.getCategories().length > 0) {
            WritableArray categories = Arguments.createArray();
            for (String category : place.getCategories()) {
                categories.pushString(category);
            }
            map.putArray("categories", categories);
        }
        if (place.getChain() != null) {
            WritableMap chain = Arguments.createMap();
            chain.putString("slug", place.getChain().getSlug());
            chain.putString("name", place.getChain().getName());
            map.putMap("chain", chain);
        }
        return map;
    }

    static WritableArray arrayForEvents(RadarEvent[] events) {
        if (events == null) {
            return null;
        }

        WritableArray arr = Arguments.createArray();
        for (RadarEvent event : events) {
            WritableMap map = RNRadarUtils.mapForEvent(event);
            arr.pushMap(map);
        }
        return arr;
    }

    private static WritableMap mapForEvent(RadarEvent event) {
        if (event == null) {
            return null;
        }

        WritableMap map = Arguments.createMap();
        map.putString("_id", event.getId());
        map.putBoolean("live", event.getLive());
        String type = RNRadarUtils.stringForEventType(event.getType());
        if (type != null) {
            map.putString("type", type);
        }
        WritableMap geofenceMap = RNRadarUtils.mapForGeofence(event.getGeofence());
        if (geofenceMap != null) {
            map.putMap("geofence", geofenceMap);
        }
        WritableMap placeMap = RNRadarUtils.mapForPlace(event.getPlace());
        if (placeMap != null) {
            map.putMap("place", placeMap);
        }
        int confidence = RNRadarUtils.numberForEventConfidence(event.getConfidence());
        map.putInt("confidence", confidence);
        if (event.getDuration() != 0) {
            map.putDouble("duration", event.getDuration());
        }
        WritableArray alternatePlaces = RNRadarUtils.arrayForAlternatePlaces(event.getAlternatePlaces());
        if (alternatePlaces != null) {
            map.putArray("alternatePlaces", alternatePlaces);
        }
        return map;
    }

    private static WritableArray arrayForAlternatePlaces(RadarPlace[] places) {
        if (places == null) {
            return null;
        }

        WritableArray arr = Arguments.createArray();
        for (RadarPlace place : places) {
            WritableMap map = RNRadarUtils.mapForPlace(place);
            arr.pushMap(map);
        }
        return arr;
    }

    static WritableMap mapForLocation(Location location) {
        if (location == null) {
            return null;
        }

        WritableMap map = Arguments.createMap();
        map.putDouble("latitude", location.getLatitude());
        map.putDouble("longitude", location.getLongitude());
        if (location.getAccuracy() != 0) {
            map.putDouble("accuracy", location.getAccuracy());
        }
        return map;
    }

    static RadarTrackingOptions optionsForMap(ReadableMap optionsMap) {
        RadarTrackingOptions.Builder options = new RadarTrackingOptions.Builder();
        if (optionsMap != null) {
            if (optionsMap.hasKey("sync")) {
                switch (optionsMap.getString("sync")) {
                    case "possibleStateChanges":
                        options.sync(RadarTrackingSync.POSSIBLE_STATE_CHANGES);
                        break;
                    case "all":
                        options.sync(RadarTrackingSync.ALL);
                        break;
                }
            }
            if (optionsMap.hasKey("offline")) {
                switch (optionsMap.getString("offline")) {
                    case "replayStopped":
                        options.offline(RadarTrackingOffline.REPLAY_STOPPED);
                        break;
                    case "replayOff":
                        options.offline(RadarTrackingOffline.REPLAY_OFF);
                        break;
                }
            }
        }
        return options.build();
    }

}
