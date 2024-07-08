"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Autocomplete.js
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const index_native_1 = __importDefault(require("../index.native"));
const images_1 = require("./images");
const styles_1 = __importDefault(require("./styles"));
const defaultAutocompleteOptions = {
    debounceMS: 200, // Debounce time in milliseconds
    minCharacters: 3, // Minimum number of characters to trigger autocomplete
    limit: 8, // Maximum number of results to return
    placeholder: "Search address", // Placeholder text for the input field
    showMarkers: true,
    disabled: false,
};
const autocompleteUI = ({ options = {} }) => {
    const [query, setQuery] = (0, react_1.useState)("");
    const [results, setResults] = (0, react_1.useState)([]);
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const animationValue = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current; // animation value
    const timerRef = (0, react_1.useRef)(null);
    const textInputRef = (0, react_1.useRef)(null);
    const config = Object.assign(Object.assign({}, defaultAutocompleteOptions), options);
    const style = config.style || {};
    const fetchResults = (0, react_1.useCallback)((searchQuery) => __awaiter(void 0, void 0, void 0, function* () {
        if (searchQuery.length < config.minCharacters)
            return;
        const { limit, layers, countryCode } = config;
        const params = { query: searchQuery, limit, layers, countryCode };
        if (config.near && config.near.latitude && config.near.longitude) {
            params.near = config.near;
        }
        try {
            const result = yield index_native_1.default.autocomplete(params);
            if (config.onResults && typeof config.onResults === "function") {
                config.onResults(result.addresses);
            }
            setResults(result.addresses);
            setIsOpen(true);
        }
        catch (error) {
            if (config.onError && typeof config.onError === "function") {
                config.onError(error);
            }
        }
    }), [config]);
    const handleInput = (0, react_1.useCallback)((text) => {
        setQuery(text);
        // Clear the existing timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (text.length < config.minCharacters) {
            return;
        }
        // Set the new timer
        timerRef.current = setTimeout(() => {
            fetchResults(text);
        }, config.debounceMS);
    }, [config, fetchResults]);
    const handleSelect = (item) => {
        setQuery(item.formattedAddress);
        setIsOpen(false);
        if (typeof config.onSelection === "function") {
            config.onSelection(item);
        }
    };
    const renderFooter = () => {
        if (results.length === 0)
            return null;
        return (<react_native_1.View style={styles.footerContainer}>
        <react_native_1.View style={{ flexDirection: "row", alignItems: "center" }}>
          <react_native_1.Text style={styles.footerText}>Powered by</react_native_1.Text>
          <react_native_1.Image source={images_1.RADAR_LOGO} resizeMode="contain" style={styles_1.default.logo}/>
        </react_native_1.View>
      </react_native_1.View>);
    };
    const renderItem = ({ item }) => {
        var _a;
        return (<react_native_1.Pressable style={({ pressed }) => [
                Object.assign(Object.assign({}, styles.resultItem), { backgroundColor: pressed
                        ? styles.resultItem.pressedBackgroundColor
                        : styles.resultItem.backgroundColor }),
            ]} onPress={() => handleSelect(item)}>
      <react_native_1.View style={styles.addressContainer}>
        <react_native_1.View style={styles.pinIconContainer}>
          {config.showMarkers ? (<react_native_1.Image source={images_1.MARKER_ICON} style={styles.pinIcon}/>) : null}
        </react_native_1.View>
        <react_native_1.View style={styles.addressTextContainer}>
          <react_native_1.Text numberOfLines={1} style={styles.addressText}>
            {item.addressLabel || (item === null || item === void 0 ? void 0 : item.placeLabel)}
          </react_native_1.Text>
          {(item === null || item === void 0 ? void 0 : item.formattedAddress.length) > 0 && (<react_native_1.Text numberOfLines={1} style={styles.addressSubtext}>
              {(_a = item === null || item === void 0 ? void 0 : item.formattedAddress) === null || _a === void 0 ? void 0 : _a.replace(`${(item === null || item === void 0 ? void 0 : item.addressLabel) || (item === null || item === void 0 ? void 0 : item.placeLabel)}, `, "")}
            </react_native_1.Text>)}
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.Pressable>);
    };
    const styles = Object.assign(Object.assign({}, styles_1.default), { container: react_native_1.StyleSheet.compose(styles_1.default.container, style.container), input: react_native_1.StyleSheet.compose(styles_1.default.input, style.input), inputContainer: react_native_1.StyleSheet.compose(styles_1.default.inputContainer, style.inputContainer), modalInputContainer: react_native_1.StyleSheet.compose(styles_1.default.modalInputContainer, style.modalInputContainer), resultList: react_native_1.StyleSheet.compose(styles_1.default.resultList, style.resultList), resultItem: react_native_1.StyleSheet.compose(Object.assign(Object.assign({}, styles_1.default.resultItem), { pressedBackgroundColor: '#F6FAFC' }), style.resultItem), addressContainer: react_native_1.StyleSheet.compose(styles_1.default.addressContainer, style.addressContainer), pinIconContainer: react_native_1.StyleSheet.compose(styles_1.default.pinIconContainer, style.pinIconContainer), pinIcon: react_native_1.StyleSheet.compose(styles_1.default.pinIcon, style.pinIcon), addressTextContainer: react_native_1.StyleSheet.compose(styles_1.default.addressTextContainer, style.addressTextContainer), addressText: react_native_1.StyleSheet.compose(styles_1.default.addressText, style.addressText), addressSubtext: react_native_1.StyleSheet.compose(styles_1.default.addressSubtext, style.addressSubtext), footerContainer: react_native_1.StyleSheet.compose(styles_1.default.footerContainer, style.footerContainer), footerText: react_native_1.StyleSheet.compose(styles_1.default.footerText, style.footerText) });
    (0, react_1.useEffect)(() => {
        react_native_1.Animated.timing(animationValue, {
            toValue: isOpen ? 1 : 0,
            duration: 300,
            easing: react_native_1.Easing.inOut(react_native_1.Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isOpen]);
    const screenHeight = react_native_1.Dimensions.get("window").height;
    const inputHeight = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [40, screenHeight],
    });
    const modalOpacity = animationValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Animated.View style={{ height: inputHeight }}>
        <react_native_1.TouchableOpacity style={styles.inputContainer} onPress={() => {
            if (config.disabled)
                return;
            setIsOpen(true);
            // Set the focus on the other textinput after it opens
            setTimeout(() => {
                textInputRef.current.focus();
            }, 100);
        }}>
          <react_native_1.Image source={images_1.SEARCH_ICON} style={styles.inputIcon}/>
          <react_native_1.TextInput style={styles.input} onFocus={() => {
            setIsOpen(true);
            setTimeout(() => {
                textInputRef.current.focus();
            }, 100);
        }} value={query} returnKeyType="done" placeholder={config.placeholder} placeholderTextColor="#acbdc8"/>
        </react_native_1.TouchableOpacity>
      </react_native_1.Animated.View>
      <react_native_1.Modal animationType="slide" transparent={false} visible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <react_native_1.Animated.View style={{ flex: 1, opacity: modalOpacity }}>
          <react_native_1.SafeAreaView>
            <react_native_1.KeyboardAvoidingView behavior={react_native_1.Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={50} style={styles.container}>
              <react_native_1.View style={styles.modalInputContainer}>
                <react_native_1.TouchableOpacity onPress={() => {
            setIsOpen(false);
        }}>
                  <react_native_1.Image source={images_1.BACK_ICON} style={styles.inputIcon}/>
                </react_native_1.TouchableOpacity>
                <react_native_1.TextInput ref={textInputRef} style={styles.input} onChangeText={handleInput} value={query} placeholder={config.placeholder} returnKeyType="done" onSubmitEditing={() => {
            setIsOpen(false);
        }} placeholderTextColor="#acbdc8"/>
                <react_native_1.TouchableOpacity onPress={() => {
            setQuery("");
        }}>
                  <react_native_1.Image source={images_1.CLOSE_ICON} style={styles.closeIcon}/>
                </react_native_1.TouchableOpacity>
              </react_native_1.View>
              {results.length > 0 && (<react_native_1.View style={styles.resultListWrapper}>
                  <react_native_1.FlatList style={styles.resultList} data={results} onScroll={() => {
                textInputRef.current.blur();
                react_native_1.Keyboard.dismiss();
            }} keyboardShouldPersistTaps="handled" renderItem={renderItem} keyExtractor={(item) => item.formattedAddress + item.postalCode}/>
                  {renderFooter()}
                </react_native_1.View>)}
            </react_native_1.KeyboardAvoidingView>
          </react_native_1.SafeAreaView>
        </react_native_1.Animated.View>
      </react_native_1.Modal>
    </react_native_1.View>);
};
exports.default = autocompleteUI;
