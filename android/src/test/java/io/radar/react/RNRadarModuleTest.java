package io.radar.react;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import io.radar.sdk.Radar;
import io.radar.sdk.Radar.RadarCallback;
import io.radar.sdk.Radar.RadarPlacesProvider;
import io.radar.sdk.Radar.RadarStatus;
import io.radar.sdk.RadarTrackingOptions;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarGeofence;
import io.radar.sdk.model.RadarUser;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.doAnswer;
import static org.powermock.api.mockito.PowerMockito.verifyStatic;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
@PrepareForTest({Radar.class, RNRadarUtils.class, ActivityCompat.class,
    ContextCompat.class, Arguments.class})
public class RNRadarModuleTest {

  @Mock
  private ReactApplicationContext context;

  private RNRadarModule module;

  @Before
  public void setup() {
    PowerMockito.mockStatic(Radar.class);
    PowerMockito.mockStatic(RNRadarUtils.class);
    PowerMockito.mockStatic(ActivityCompat.class);
    PowerMockito.mockStatic(ContextCompat.class);
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

    module = new RNRadarModule(context);
  }

  @Test
  public void getName() {
    assertEquals("RNRadar", module.getName());
  }

  @Test
  public void setUserId() {
    String userId = "userId123";

    module.setUserId(userId);

    verifyStatic(Radar.class);
    Radar.setUserId(userId);
  }

  @Test
  public void setDescription() {
    String description = "some user description";

    module.setDescription(description);

    verifyStatic(Radar.class);
    Radar.setDescription(description);
  }

  @Test
  public void setMetadata() throws JSONException {
    ReadableMap metadataMap = new JavaOnlyMap();
    JSONObject metadata = new JSONObject("{test:123}");
    when(RNRadarUtils.jsonObjectForMap(metadataMap)).thenReturn(metadata);

    System.err.println(metadata.toString());
    module.setMetadata(metadataMap);

    verifyStatic(Radar.class);
    Radar.setMetadata(metadata);
  }

  @Test
  public void setPlacesProvider() {
    String providerStr = "facebook2";
    RadarPlacesProvider provider = RadarPlacesProvider.FACEBOOK;
    when(RNRadarUtils.placesProviderForString(providerStr)).thenReturn(provider);

    module.setPlacesProvider(providerStr);

    verifyStatic(Radar.class);
    Radar.setPlacesProvider(provider);
  }

  @Test
  public void getPermissionStatus() {
    when(ContextCompat.checkSelfPermission(any(Context.class), anyString()))
        .thenReturn(PackageManager.PERMISSION_GRANTED);
    String statusString = "granted";
    when(RNRadarUtils.stringForPermissionsStatus(anyBoolean())).thenReturn(statusString);

    Promise promise = mock(Promise.class);
    module.getPermissionsStatus(promise);

    verify(promise).resolve(statusString);
  }

  @Test
  public void requestPermissions() {
    when(context.getCurrentActivity()).thenReturn(mock(Activity.class));

    module.requestPermissions(true);

    PowerMockito.verifyStatic(ActivityCompat.class);
    ActivityCompat.requestPermissions(
        any(Activity.class),
        eq(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}),
        anyInt()
    );
  }

  @Test
  public void startTracking() {
    ReadableMap optionsMap = new JavaOnlyMap();
    RadarTrackingOptions options = new RadarTrackingOptions.Builder().build();
    when(RNRadarUtils.optionsForMap(optionsMap)).thenReturn(options);

    module.startTracking(optionsMap);

    verifyStatic(Radar.class);
    Radar.startTracking(options);
  }

  @Test
  public void stopTracking() {
    module.stopTracking();

    PowerMockito.verifyStatic(Radar.class);
    Radar.stopTracking();
  }

  @Test
  public void trackOnce() {
    final RadarStatus status = RadarStatus.SUCCESS;
    final Location location = mock(Location.class);
    final RadarEvent[] events = new RadarEvent[3];
    final RadarUser user =
        new RadarUser("someId123", "userId321", "deviceId231", "description - 123", null,
            mock(Location.class), new RadarGeofence[]{}, null, null, true, true);
    doAnswer(new Answer<Void>() {
      @Override
      public Void answer(InvocationOnMock invocation) {
        RadarCallback callback = invocation.getArgument(0);
        callback.onComplete(status, location, events, user);
        return null;
      }
    }).when(Radar.class);
    Radar.trackOnce(any(RadarCallback.class));

    Promise promise = mock(Promise.class);
    module.trackOnce(promise);

    verifyStatic(Radar.class);
    Radar.trackOnce(any(RadarCallback.class));

    verify(promise).resolve(any(ReadableMap.class));
  }

  @Test
  public void trackOnce_fail() {
    final RadarStatus status = RadarStatus.ERROR_NETWORK;
    final String statusStr = "ERROR";
    when(RNRadarUtils.stringForStatus(status)).thenReturn(statusStr);
    doAnswer(new Answer<Void>() {
      @Override
      public Void answer(InvocationOnMock invocation) {
        RadarCallback callback = invocation.getArgument(0);
        callback.onComplete(status, null, null, null);
        return null;
      }
    }).when(Radar.class);
    Radar.trackOnce(any(RadarCallback.class));

    Promise promise = mock(Promise.class);
    module.trackOnce(promise);

    verifyStatic(Radar.class);
    Radar.trackOnce(any(RadarCallback.class));

    verify(promise).reject(statusStr, statusStr);
  }

  @Test
  public void updateLocation() {
    WritableMap locationMap = new JavaOnlyMap();
    locationMap.putDouble("latitude", 100);
    locationMap.putDouble("longitude", 10);
    locationMap.putDouble("accuracy", 50);

    module.updateLocation(locationMap, mock(Promise.class));

    verifyStatic(Radar.class);
    Radar.updateLocation(any(Location.class), any(RadarCallback.class));
  }

  @Test
  public void acceptEvent() {
    String eventId = "eventId123";
    String verifiedPlaceId = "somePlace123";

    module.acceptEvent(eventId, verifiedPlaceId);

    verifyStatic(Radar.class);
    Radar.acceptEvent(eventId, verifiedPlaceId);
  }

  @Test
  public void rejectEvent() {
    String eventId = "eventId123";

    module.rejectEvent(eventId);

    verifyStatic(Radar.class);
    Radar.rejectEvent(eventId);
  }
}
