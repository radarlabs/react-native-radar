// Autocomplete.js
import React, { useState, useCallback } from 'react';
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
    justifyContent: 'center',
    padding: 8,
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    fontSize: 14,
    padding: 10,
    borderRadius: 5,
    width: '95%',
    shadowColor: "#061A2B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputFocused: {
    shadowColor: "#81BEFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  resultList: {
    width: '95%',
    marginBottom: 8,
    borderRadius: 5,
    marginTop: 8,
    marginLeft: 4,
    marginRight: 4,
    shadowColor: "#061A2B",
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'visible',
  },
  resultItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  addressSubtext: {
    fontSize: 12,
    color: '#5A6872',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
  },
  footerText: {
    marginTop: 2,
    marginRight: 4,
    fontSize: 10,
    color: '#5A6872',
  },
  logo: {
    width: 50,
    height: 15,
    resizeMode: 'contain',
  },
});

const defaultAutocompleteOptions = {
  debounceMS: 200,
  threshold: 3,
  limit: 8,
  placeholder: 'Search address',
  showSelectButton: false,
  buttonText: 'Select',
};

const autocompleteUI = ({ options = {}, onSelect, location, style = {} }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInputFocused, setInputFocused] = useState(false);

  const config = { ...defaultAutocompleteOptions, ...options };

  const fetchResults = useCallback(async (searchQuery) => {
    if (searchQuery.length < config.threshold) return;

    const params = { query: searchQuery, limit: config.limit };

    if (location && location.latitude && location.longitude) {
      params.near = location;
    }

    try {
      const result = await Radar.autocomplete(params);
      setResults(result.addresses);
      setIsOpen(true);
    } catch (error) {
      if (config.onError && typeof config.onError === 'function') {
        config.onError(error);
      }
    }
  }, [config]);

  const handleInput = (text) => {
    setQuery(text);
    clearTimeout(window.timer);
    window.timer = setTimeout(() => fetchResults(text), config.debounceMS);
  };

  const handleSelect = (item) => {
    setQuery(item.formattedAddress);
    setIsOpen(false);

    if (typeof onSelect === 'function') {
      onSelect(item);
    }
  };

  const renderFooter = () => {
    if (results.length === 0) return null;

    return (
      <View style={styles.footerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.footerText}>Powered by</Text>
          <Image source={require('./radar-logo.png')} resizeMode="contain" style={defaultStyles.logo} />
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
      <Text numberOfLines={1} style={styles.addressText}>
        {item.addressLabel || item?.placeLabel}
      </Text>
      <Text numberOfLines={1} style={styles.addressSubtext}>
        {item?.formattedAddress?.replace(`${item?.addressLabel || item?.placeLabel}, `, '')}
      </Text>
    </TouchableOpacity>
  );

  const styles = {
    ...defaultStyles,
    container: StyleSheet.compose(defaultStyles.container, style.container),
    input: StyleSheet.compose(defaultStyles.input, style.input),
    resultList: StyleSheet.compose(defaultStyles.resultList, style.resultList),
    resultItem: StyleSheet.compose(defaultStyles.resultItem, style.resultItem),
    addressText: StyleSheet.compose(defaultStyles.addressText, style.addressText),
    addressSubtext: StyleSheet.compose(defaultStyles.addressSubtext, style.addressSubtext),
    footerContainer: StyleSheet.compose(defaultStyles.footerContainer, style.footerContainer),
    footerText: StyleSheet.compose(defaultStyles.footerText, style.footerText),
  };

  const inputStyle = isInputFocused
    ? StyleSheet.compose(styles.input, defaultStyles.inputFocused)
    : styles.input;

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyle}
        onChangeText={handleInput}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        value={query}
        placeholder={config.placeholder}
      />
      {isOpen && (
        <FlatList
          style={styles.resultList}
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.formattedAddress + item.postalCode}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

export default autocompleteUI;
