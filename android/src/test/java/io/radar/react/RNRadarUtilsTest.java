package io.radar.react;

import android.location.Location;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import io.radar.sdk.Radar.RadarPlacesProvider;
import io.radar.sdk.Radar.RadarStatus;
import io.radar.sdk.Radar.RadarTrackingOffline;
import io.radar.sdk.Radar.RadarTrackingPriority;
import io.radar.sdk.Radar.RadarTrackingSync;
import io.radar.sdk.RadarTrackingOptions;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarEvent.RadarEventConfidence;
import io.radar.sdk.model.RadarEvent.RadarEventType;
import io.radar.sdk.model.RadarEvent.RadarEventVerification;
import io.radar.sdk.model.RadarGeofence;
import io.radar.sdk.model.RadarUser;
import io.radar.sdk.model.RadarUserInsightsLocation.RadarUserInsightsLocationConfidence;
import io.radar.sdk.model.RadarUserInsightsLocation.RadarUserInsightsLocationType;
import java.util.Date;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Arguments.class)
public class RNRadarUtilsTest {

  @Before
  public void setup() {
    PowerMockito.mockStatic(Arguments.class);
    when(Arguments.createMap()).then(new Answer<WritableMap>() {
      @Override
      public WritableMap answer(InvocationOnMock invocation) {
        return new JavaOnlyMap();
      }
    });
    when(Arguments.createArray()).then(new Answer<WritableArray>() {
      @Override
      public WritableArray answer(InvocationOnMock invocation) {
        return new JavaOnlyArray();
      }
    });
  }

  @Test
  public void stringForPermissionStatus() {
    final String grantedBg = RNRadarUtils.stringForPermissionsStatus(true, true);
    assertEquals("GRANTED_BACKGROUND", grantedBg);

    final String grantedFg = RNRadarUtils.stringForPermissionsStatus(true, false);
    assertEquals("GRANTED_FOREGROUND", grantedFg);

    final String denied = RNRadarUtils.stringForPermissionsStatus(false, false);
    assertEquals("DENIED", denied);

    final String denied2 = RNRadarUtils.stringForPermissionsStatus(false, true);
    assertEquals("DENIED", denied2);
  }

  @Test
  public void stringForStatus() {
    for (RadarStatus status : RadarStatus.values()) {
      final String statusString = RNRadarUtils.stringForStatus(status);
      assertEquals(status.toString(), statusString);
    }
  }

  @Test
  public void stringForEventType() {
    for (RadarEventType type : RadarEventType.values()) {
      final String typeString = RNRadarUtils.stringForEventType(type);
      if (type == RadarEventType.UNKNOWN) {
        assertNull(typeString);
      } else {
        assertNotNull("String for type " + type + " was null", typeString);
      }
    }
  }

  @Test
  public void numberForEventConfidence() {
    int confidence = RNRadarUtils.numberForEventConfidence(RadarEventConfidence.HIGH);
    assertEquals(3, confidence);

    confidence = RNRadarUtils.numberForEventConfidence(RadarEventConfidence.MEDIUM);
    assertEquals(2, confidence);

    confidence = RNRadarUtils.numberForEventConfidence(RadarEventConfidence.LOW);
    assertEquals(1, confidence);

    confidence = RNRadarUtils.numberForEventConfidence(RadarEventConfidence.NONE);
    assertEquals(0, confidence);
  }

  @Test
  public void stringForUserInsightsLocationType() {
    final String home =
        RNRadarUtils.stringForUserInsightsLocationType(RadarUserInsightsLocationType.HOME);
    assertEquals("home", home);

    final String office =
        RNRadarUtils.stringForUserInsightsLocationType(RadarUserInsightsLocationType.OFFICE);
    assertEquals("office", office);

    final String unknown =
        RNRadarUtils.stringForUserInsightsLocationType(RadarUserInsightsLocationType.UNKNOWN);
    assertNull(unknown);
  }

  @Test
  public void numberForUserInsightsLocationConfidence() {
    int confidence = RNRadarUtils
        .numberForUserInsightsLocationConfidence(RadarUserInsightsLocationConfidence.HIGH);
    assertEquals(3, confidence);

    confidence = RNRadarUtils
        .numberForUserInsightsLocationConfidence(RadarUserInsightsLocationConfidence.MEDIUM);
    assertEquals(2, confidence);

    confidence = RNRadarUtils
        .numberForUserInsightsLocationConfidence(RadarUserInsightsLocationConfidence.LOW);
    assertEquals(1, confidence);

    confidence = RNRadarUtils
        .numberForUserInsightsLocationConfidence(RadarUserInsightsLocationConfidence.NONE);
    assertEquals(0, confidence);
  }

  @Test
  public void placesProviderForString() {
    RadarPlacesProvider provider = RNRadarUtils.placesProviderForString("facebook");
    assertEquals(RadarPlacesProvider.FACEBOOK, provider);

    provider = RNRadarUtils.placesProviderForString("none");
    assertEquals(RadarPlacesProvider.NONE, provider);

    provider = RNRadarUtils.placesProviderForString("invalid string");
    assertEquals(RadarPlacesProvider.NONE, provider);
  }

  @Test
  public void mapForUser() {
    RadarUser user =
        new RadarUser("someId123", "userId321", "deviceId231", "description - 123", null,
            mock(Location.class), new RadarGeofence[]{}, null, null, true, true, null, null, null, null, null);

    ReadableMap userMap = RNRadarUtils.mapForUser(user);

    assertEquals(user.getId(), userMap.getString("_id"));
    assertEquals(user.getUserId(), userMap.getString("userId"));
    assertEquals(user.getDescription(), userMap.getString("description"));
    assertEquals(user.getMetadata(), userMap.getMap("metadata"));
    assertEquals(0, userMap.getArray("geofences").size());
    assertNull(userMap.getMap("insights"));
    assertNull(userMap.getMap("place"));
  }

  @Test
  public void arrayForEvents() {
    RadarEvent[] events = new RadarEvent[5];
    for (int i = 0; i < events.length; i++) {
      events[i] =
          new RadarEvent("" + i, new Date(), new Date(), true, RadarEventType.USER_ENTERED_HOME,
              null, null, null, null, null, RadarEventVerification.UNVERIFY, RadarEventConfidence.HIGH,
              1000f, mock(Location.class));
    }

    ReadableArray eventArray = RNRadarUtils.arrayForEvents(events);

    assertEquals(events.length, eventArray.size());
    for (int j = 0; j < events.length; j++) {
      RadarEvent expected = events[j];
      ReadableMap actual = eventArray.getMap(j);
      assertEquals(expected.getId(), actual.getString("_id"));
    }
  }

  @Test
  public void mapForLocation() {
    Location location = mock(Location.class);
    when(location.getLatitude()).thenReturn(4.0);
    when(location.getLongitude()).thenReturn(20.0);
    when(location.getAccuracy()).thenReturn(100f);

    ReadableMap locationMap = RNRadarUtils.mapForLocation(location);

    assertEquals(location.getLatitude(), locationMap.getDouble("latitude"), 0.0001);
    assertEquals(location.getLongitude(), locationMap.getDouble("longitude"), 0.0001);
    assertEquals(location.getAccuracy(), locationMap.getDouble("accuracy"), 0.0001);
  }

  @Test
  public void optionsForMap() {
    WritableMap optionsMap = new JavaOnlyMap();
    optionsMap.putString("sync", "all");
    optionsMap.putString("offline", "replayOff");
    optionsMap.putString("priority", "efficiency");
    optionsMap.putString("invalid", "shouldBeIgnored");

    RadarTrackingOptions options = RNRadarUtils.optionsForMap(optionsMap);

    assertEquals(RadarTrackingSync.ALL, options.getSync());
    assertEquals(RadarTrackingOffline.REPLAY_OFF, options.getOffline());
    assertEquals(RadarTrackingPriority.EFFICIENCY, options.getPriority());
  }

  @Test
  public void defaultOptionsForMap() {
    WritableMap optionsMap = new JavaOnlyMap();
    optionsMap.putString("invalid", "shouldBeIgnored");

    RadarTrackingOptions options = RNRadarUtils.optionsForMap(optionsMap);

    assertEquals(RadarTrackingSync.POSSIBLE_STATE_CHANGES, options.getSync());
    assertEquals(RadarTrackingOffline.REPLAY_STOPPED, options.getOffline());
    assertEquals(RadarTrackingPriority.RESPONSIVENESS, options.getPriority());
  }

  @Test
  public void jsonObjectForMap() throws JSONException {
    WritableMap optionsMap = new JavaOnlyMap();
    optionsMap.putString("stringKey", "some string");
    optionsMap.putInt("intKey", 123);
    optionsMap.putDouble("doubleKey", 1.23);
    optionsMap.putBoolean("boolKey", true);
    optionsMap.putMap("otherTypeKey", new JavaOnlyMap());

    JSONObject obj = RNRadarUtils.jsonObjectForMap(optionsMap);

    assertEquals("some string", obj.getString("stringKey"));
    assertEquals(123, obj.getInt("intKey"));
    assertEquals(1.23, obj.getDouble("doubleKey"), 0.01);
    assertTrue(obj.getBoolean("boolKey"));
    assertFalse(obj.has("otherTypeKey"));
  }
}
