package io.radar.react;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.util.Iterator;

import org.jetbrains.annotations.Contract;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

/**
 * Contains utilities for converting between native and react data structures
 */
class RNRadarUtils {

    /**
     * Converts the given {@link JSONObject} into a {@link WritableMap}
     *
     * @param obj the {@code JSONObject} to convert
     * @return a {@code WriteableMap} containing the key-value pairs from {@code obj}
     * @throws JSONException if an error occurs while parsing the given {@code JSONObject}
     */
    @Nullable
    static WritableMap mapForJson(@Nullable JSONObject obj) throws JSONException {
        if (obj == null) {
            return null;
        }

        WritableMap writableMap = new WritableNativeMap();
        Iterator<String> iterator = obj.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = obj.get(key);
            if (value instanceof JSONObject) {
                writableMap.putMap(key, mapForJson((JSONObject) value));
            } else if (value instanceof JSONArray) {
                writableMap.putArray(key, arrayForJson((JSONArray) value));
            } else if (value instanceof Boolean) {
                writableMap.putBoolean(key, (Boolean) value);
            } else if (value instanceof Integer) {
                writableMap.putInt(key, (Integer) value);
            } else if (value instanceof Double) {
                writableMap.putDouble(key, (Double) value);
            } else if (value instanceof Float) {
                String valueStr = value.toString();
                double valueDouble = Double.parseDouble(valueStr);
                writableMap.putDouble(key, valueDouble);
            } else if (value instanceof String) {
                writableMap.putString(key, (String) value);
            }
        }
        return writableMap;
    }

    /**
     * Converts the given {@link JSONArray} into a {@link WritableArray}
     *
     * @param arr the {@code JSONArray} to convert
     * @return a {@code WritableArray} containing the values from {@code arr}
     * @throws JSONException if an error occurs while parsing the given {@code JSONArray}
     */
    @Nullable
    static WritableArray arrayForJson(@Nullable JSONArray arr) throws JSONException {
        if (arr == null) {
            return null;
        }

        WritableArray writableArr = new WritableNativeArray();
        for (int i = 0; i < arr.length(); i++) {
            Object value = arr.get(i);
            if (value instanceof JSONObject) {
                writableArr.pushMap(mapForJson((JSONObject) value));
            } else if (value instanceof JSONArray) {
                writableArr.pushArray(arrayForJson((JSONArray) value));
            } else if (value instanceof Boolean) {
                writableArr.pushBoolean((Boolean) value);
            } else if (value instanceof Integer) {
                writableArr.pushInt((Integer) value);
            } else if (value instanceof Double) {
                writableArr.pushDouble((Double) value);
            } else if (value instanceof String) {
                writableArr.pushString((String) value);
            }
        }
        return writableArr;
    }

    /**
     * Converts the given {@link ReadableMap} into a {@link JSONObject}
     *
     * @param readableMap the {@code ReadableMap} to convert
     * @return a {@code JSONObject} containing the key-value pairs from {@code readableMap}
     * @throws JSONException if an error occurs while creating the {@code JSONObject}
     */
    @Nullable
    @Contract("null -> null; !null -> !null")
    @SuppressWarnings("checkstyle:MissingSwitchDefault")
    static JSONObject jsonForMap(@Nullable ReadableMap readableMap) throws JSONException {
        if (readableMap == null) {
            return null;
        }

        JSONObject obj = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    obj.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    obj.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    obj.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    obj.put(key, readableMap.getString(key));
                    break;
                case Map:
                    obj.put(key, jsonForMap(readableMap.getMap(key)));
                    break;
                case Array:
                    obj.put(key, jsonForArray(readableMap.getArray(key)));
                    break;
            }
        }
        return obj;
    }

    /**
     * Converts the given {@link ReadableArray} into a {@link JSONArray}
     *
     * @param readableArr the {@code ReadableArray} to convert
     * @return a {@code JSONArray} containing the values from {@code readableArr}
     * @throws JSONException if an error occurs while creating the {@code JSONArray}
     */
    @Nullable
    @SuppressWarnings("checkstyle:MissingSwitchDefault")
    static JSONArray jsonForArray(@Nullable ReadableArray readableArr) throws JSONException {
        if (readableArr == null) {
            return null;
        }

        JSONArray arr = new JSONArray();
        for (int i = 0; i < readableArr.size(); i++) {
            switch (readableArr.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    arr.put(readableArr.getBoolean(i));
                    break;
                case Number:
                    arr.put(readableArr.getDouble(i));
                    break;
                case String:
                    arr.put(readableArr.getString(i));
                    break;
                case Map:
                    arr.put(jsonForMap(readableArr.getMap(i)));
                    break;
                case Array:
                    arr.put(jsonForArray(readableArr.getArray(i)));
                    break;
            }
        }
        return arr;
    }

    /**
     * Converts the given {@link ReadableArray} into a String Array
     *
     * @param readableArr the {@code ReadableArray} to convert
     * @return a String[] containing the values of the given parameter
     */
    @NonNull
    static String[] stringArrayForArray(@Nullable ReadableArray readableArr) {
        if (readableArr == null) {
            return new String[0];
        }
        int size = readableArr.size();
        String[] arr = new String[size];
        for (int i = 0; i < size; i++) {
            arr[i] = readableArr.getString(i);
        }
        return arr;
    }

}
