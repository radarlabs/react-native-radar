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

const defaultStyles = StyleSheet.create({
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
    borderRadius: 10,
    borderColor: '#ccc',
  },
  resultList: {
    width: '90%',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectButton: {
    borderColor: '#000275',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    justifyContent: 'center',
  },
  selectButtonText: {
    color: '#000275',
    fontSize: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#000',
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
  showSelectButton: false,
  buttonText: 'Select',
};

const autocompleteUI = ({ options = {}, onSelect, location, style = {} }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const config = { ...defaultAutocompleteOptions, ...options };

  const styles = {
    container: StyleSheet.compose(defaultStyles.container, style.container),
    input: StyleSheet.compose(defaultStyles.input, style.input),
    resultList: StyleSheet.compose(defaultStyles.resultList, style.resultList),
    resultItem: StyleSheet.compose(defaultStyles.resultItem, style.resultItem),
    footerContainer: StyleSheet.compose(defaultStyles.footerContainer, style.footerContainer),
    footerText: StyleSheet.compose(defaultStyles.footerText, style.footerText),
  };

  const fetchResults = useCallback(async (searchQuery) => {
    const params = {
      query: searchQuery,
      limit: config.limit,
    };

    if (location && location.latitude && location.longitude) {
      params.near = location;
    }

    Radar.autocomplete(params).then((result: any) => {
      setResults(result.addresses);
      setIsOpen(true);
    }).catch((error) => {
      if (config.onError && typeof config.onError === 'function') {
        config.onError(error);
      }
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

    if (onSelect && typeof onSelect === 'function') {
      onSelect(item);
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

  const renderItem = ({ item }) => {
    const addressElement =
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        <Text numberOfLines={1} style={{ ...styles.addressText, fontWeight: '800' }}>
          {item.addressLabel || item?.placeLabel}
        </Text>
        <Text numberOfLines={1} style={styles.addressText}>
          {item?.formattedAddress?.replace(`${item?.addressLabel || item?.placeLabel}, `, '')}
        </Text>
      </View>;

    if (config.showSelectButton) {
      return (
        <View style={{ ...styles.resultItem, flexDirection: 'row' }}>
          {addressElement}
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.selectButtonText}>{config.buttonText}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleSelect(item)}
      >
        {addressElement}
      </TouchableOpacity>
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
          renderItem={renderItem}
          keyExtractor={item => item.formattedAddress + item.postalCode}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

export default autocompleteUI;
