// Autocomplete.js
import React, { useState, useCallback, useRef } from 'react';
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: "#061A2B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputIcon: {
    marginLeft: 10,
    height: 18,
    width: 18,
    backgroundColor: 'white',
    color: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    height: 40,
    fontSize: 14,
    paddingTop: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    shadowOpacity: 0,
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
  resultListWrapper: {
    width: '95%',
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: "#061A2B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  resultList: {
    width: '100%',
  },
  resultItem: {
    paddingRight: 16,
    paddingVertical: 8,
    height: 56,
    fontSize: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIconContainer: {
    width: 28,
  },
  pinIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
    marginBottom: 14,
  },
  addressTextContainer: {
    flex: 1,
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
  showPin: true,
};

const autocompleteUI = ({ options = {}, onSelect, location, style = {} }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInputFocused, setInputFocused] = useState(false);
  const timerRef = useRef(null);

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

  const handleInput = useCallback(
    (text) => {
      setQuery(text);

      // Clear the existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (text.length < config.threshold) {
        return;
      }

      // Set the new timer
      timerRef.current = setTimeout(() => {
        fetchResults(text);
      }, config.debounceMS);
    },
    [config, fetchResults],
  );

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
      <View style={styles.addressContainer}>
        <View style={styles.pinIconContainer}>
          {config.showPin ? (
            <Image source={require('./marker.png')} style={styles.pinIcon} />
          ) : null}
        </View>
        <View style={styles.addressTextContainer}>
          <Text numberOfLines={1} style={styles.addressText}>
            {item.addressLabel || item?.placeLabel}
          </Text>
          <Text numberOfLines={1} style={styles.addressSubtext}>
            {item?.formattedAddress?.replace(`${item?.addressLabel || item?.placeLabel}, `, '')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = {
    ...defaultStyles,
    container: StyleSheet.compose(defaultStyles.container, style.container),
    input: StyleSheet.compose(defaultStyles.input, style.input),
    resultList: StyleSheet.compose(defaultStyles.resultList, style.resultList),
    resultItem: StyleSheet.compose(defaultStyles.resultItem, style.resultItem),
    addressContainer: StyleSheet.compose(defaultStyles.addressContainer, style.addressContainer),
    pinIconContainer: StyleSheet.compose(defaultStyles.pinIconContainer, style.pinIconContainer),
    pinIcon: StyleSheet.compose(defaultStyles.pinIcon, style.pinIcon),
    addressTextContainer: StyleSheet.compose(defaultStyles.addressTextContainer, style.addressTextContainer),
    addressText: StyleSheet.compose(defaultStyles.addressText, style.addressText),
    addressSubtext: StyleSheet.compose(defaultStyles.addressSubtext, style.addressSubtext),
    footerContainer: StyleSheet.compose(defaultStyles.footerContainer, style.footerContainer),
    footerText: StyleSheet.compose(defaultStyles.footerText, style.footerText),
  };

  const inputStyle = isInputFocused
    ? StyleSheet.compose(styles.inputContainer, defaultStyles.inputFocused)
    : styles.inputContainer;

  return (
    <View style={styles.container}>
      <View style={inputStyle}>
        <Image source={require('./search.png')} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          onChangeText={handleInput}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          value={query}
          placeholder={config.placeholder}
        />
      </View>
      {isOpen && (
        <View style={defaultStyles.resultListWrapper}>
          <FlatList
            style={styles.resultList}
            data={results}
            renderItem={renderItem}
            keyExtractor={(item) => item.formattedAddress + item.postalCode}
            ListFooterComponent={renderFooter}
          />
        </View>
      )}
    </View>
  );
};

export default autocompleteUI;
