// Autocomplete.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Radar from '../index.native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  resultList: {
    width: '90%',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-start',
  },
  footerText: {
    marginTop: 2,
    marginRight: 8,
  },
  logo: {
    width: 60,
    height: 18,
    resizeMode: 'contain',
  },
});

const defaultAutocompleteOptions = {
  debounceMS: 200, // Debounce time in milliseconds
  threshold: 3, // Minimum number of characters to trigger autocomplete
  limit: 8, // Maximum number of autocomplete results
  placeholder: 'Search address', // Placeholder text for the input field
  disabled: false,
};

const autocompleteUI = ({ options = {} }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const config = { ...defaultAutocompleteOptions, ...options };

  const fetchResults = useCallback(async (searchQuery) => {
    const params = {
      query: searchQuery,
      limit: config.limit,
    };

    Radar.autocomplete(params).then((result: any) => {
      setResults(result.addresses);
      setIsOpen(true);
    }).catch((error) => {
      console.log('error', error);
      // Logger.warn(`Autocomplete ui error: ${error.message}`);
      // Handle error, e.g. call config.onError(error) if onError is provided in options
    });
  }, [config]);

  const handleInput = useCallback(
    (text) => {
      setQuery(text);
      if (text.length < config.threshold) {
        return;
      }
      const timer = setTimeout(() => {
        fetchResults(text);
      }, config.debounceMS);

      return () => clearTimeout(timer);
    },
    [config, fetchResults],
  );

  const handleSelect = (item) => {
    setQuery(item.formattedAddress);
    setIsOpen(false);
    
    if (config.onSelect && typeof config.onSelect === 'function') {
      config.onSelect(item);
    }
  };

  const renderFooter = () => {
    if (results.length <= 1) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.footerText}>Powered by</Text>
          <Image source={require('./radar-logo.png')} style={styles.logo} />
        </View>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={handleInput}
        value={query}
        placeholder={config.placeholder}
        editable={!config.disabled}
      />
      {isOpen && (
        <FlatList
          style={styles.resultList}
          data={results}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelect(item)}
            >
              <Text>{item.formattedAddress}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.formattedAddress + item.postalCode}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

export default autocompleteUI;
