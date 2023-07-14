## Example usage

We provide UI elements for autocomplete & maps to make building easy.

If you're using the Map element, you'll need to install [Maplibre React Native](https://github.com/maplibre/maplibre-react-native).
```
npm install @maplibre/maplibre-react-native
```

Then make sure to complete required [platform specific installation steps](https://github.com/maplibre/maplibre-react-native/blob/main/docs/GettingStarted.md#review-platform-specific-info) as well.

### Adding a map

We've taken care of linking the map tile server to the map, so all you need to do is make sure you've initialized the Radar SDK and use `<Map>`

```
import {StyleSheet, View} from 'react-native';
import Radar, { Map } from 'react-native-radar';

export default function App() {
    Radar.initialize('prj_place_your_own_token_here');
    
    // A quirk of Map Libre requires us to set their deprecated access token to null
    MapLibreGL.setAccessToken(null);

    return (
        <View style={styles.page}>
            <Map />
        </View>
    );
}
```

TODO: fill in details on customization, including using MapLibre elements

### Adding an address autocomplete

Adding an address search autocomplete is similarly easy. Our `<Autocomplete>` element is comprised of a TextInput and Flatlist with the results.

The example below provides optional `location` and `onSelect` props to the component. Providing a location will improve autocomplete result quality. Without it, the API utilizes the IP address location to rank results.

```
import { View } from 'react-native';
import { useState, useEffect } from 'react';
import Radar, { Autocomplete } from 'react-native-radar';

export default function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    Radar.initialize('YOUR_PUBLISHABLE_KEY_HERE');

    Radar.trackOnce().then((result) => {
        setLocation({
          latitude: result.location.latitude,
          longitude: result.location.longitude,
        });
      });
  }, []);

  const onSelect = (selectedAddress) => {
      // Do something with the selected address
  }

  return (
      <View style={{ marginTop: 50}}>>
          <Autocomplete location={location} onSelect={onSelect} />
      </View>
  );
}

```

TODO: fill in details of customization
