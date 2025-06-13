import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { initialize, trackOnce, getItem, setItem, removeItem, clear } from 'react-native-radar';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [key, setKey] = useState('test-key');
  const [value, setValue] = useState('test-value');
  const [storedValue, setStoredValue] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<{ [key: string]: string }>({});
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const loadStoredValue = () => {
    const result = getItem(key);
    setStoredValue(result);
  };

  const requestLocationPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to location for tracking.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasLocationPermission(true);
          Alert.alert('Success', '✅ Location permissions granted.');
        } else {
          Alert.alert('Error', '❌ Location permission denied.');
        }
      } else {
        // For iOS, we'll assume permission is handled by the native module
        setHasLocationPermission(true);
        Alert.alert('Success', '✅ Location permissions granted.');
      }
    } catch (error) {
      Alert.alert('Error', `❌ Permission request failed: ${error}`);
    }
  };

  const initializeRadar = () => {
    try {
      initialize(
        "prj_test_pk_4899327d5733b7741a3bfa223157f3859273be46", // Test key
        false // No fraud detection for simplicity
      );
      setIsInitialized(true);
      Alert.alert('Success', `✅ Radar initialized successfully with TurboModule`);
    } catch (error) {
      Alert.alert('Error', `❌ Radar initialization failed: ${error}`);
    }
  };

  const triggerTrackOnce = () => {
    if (!isInitialized) {
      Alert.alert('Error', `❌ Please initialize Radar first`);
      return;
    }

    if (!hasLocationPermission) {
      Alert.alert('Error', `❌ Please grant location permissions first`);
      return;
    }

    trackOnce()
      .then((result: any) => {
        console.log('trackOnce result:', result);
        Alert.alert('Success', `✅ trackOnce completed: \n${JSON.stringify(result)}`);
      })
      .catch((err: any) => {
        Alert.alert('Error', `❌ trackOnce error: ${JSON.stringify(err)}`);
      });
  };

  const handleSetItem = () => {
    setItem(key, value);
    Alert.alert('Success', `Set "${key}" = "${value}"`);
    loadStoredValue();
    loadAllItems();
  };

  const handleGetItem = () => {
    loadStoredValue();
    const result = getItem(key);
    Alert.alert('Get Item', result ? `Value: "${result}"` : 'Key not found');
  };

  const handleRemoveItem = () => {
    removeItem(key);
    Alert.alert('Success', `Removed "${key}"`);
    loadStoredValue();
    loadAllItems();
  };

  const handleClear = () => {
    clear();
    Alert.alert('Success', 'All items cleared');
    loadStoredValue();
    loadAllItems();
  };

  const loadAllItems = () => {
    // For demo purposes, try to load some common test keys
    const testKeys = ['test-key', 'name', 'email', 'settings', 'theme'];
    const items: { [key: string]: string } = {};

    testKeys.forEach(testKey => {
      const value = getItem(testKey);
      if (value !== null) {
        items[testKey] = value;
      }
    });

    setAllItems(items);
  };

  useEffect(() => {
    loadStoredValue();
    loadAllItems();
  }, [key]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Native Radar Demo</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Key:</Text>
        <TextInput
          style={styles.input}
          value={key}
          onChangeText={setKey}
          placeholder="Enter key"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Value:</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="Enter value"
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.label}>Stored Value for "{key}":</Text>
        <Text style={styles.result}>{storedValue || 'null'}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={initializeRadar}>
          <Text style={styles.buttonText}>
            {isInitialized ? "✅ TurboModule Initialized" : "🔧 Initialize TurboModule"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={requestLocationPermissions}>
          <Text style={styles.buttonText}>
            {hasLocationPermission ? "✅ Permissions Granted" : "📍 Request Permissions"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={triggerTrackOnce}>
          <Text style={styles.buttonText}>🚀 Test trackOnce</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSetItem}>
          <Text style={styles.buttonText}>Set Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleGetItem}>
          <Text style={styles.buttonText}>Get Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={handleRemoveItem}>
          <Text style={styles.buttonText}>Remove Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.allItemsContainer}>
        <Text style={styles.sectionTitle}>All Stored Items:</Text>
        {Object.keys(allItems).length > 0 ? (
          Object.entries(allItems).map(([itemKey, itemValue]) => (
            <View key={itemKey} style={styles.itemRow}>
              <Text style={styles.itemKey}>{itemKey}:</Text>
              <Text style={styles.itemValue}>{itemValue}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No items stored</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  resultContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
  },
  result: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#0066cc',
  },
  buttonsContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#FF9500',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  allItemsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingVertical: 2,
  },
  itemKey: {
    fontWeight: '600',
    marginRight: 8,
    color: '#666',
    minWidth: 80,
  },
  itemValue: {
    flex: 1,
    fontFamily: 'monospace',
    color: '#333',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
  },
});
