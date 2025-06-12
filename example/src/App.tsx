import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { getItem, setItem, removeItem, clear } from 'react-native-radar';

export default function App() {
  const [key, setKey] = useState('test-key');
  const [value, setValue] = useState('test-value');
  const [storedValue, setStoredValue] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<{ [key: string]: string }>({});

  const loadStoredValue = () => {
    const result = getItem(key);
    setStoredValue(result);
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
