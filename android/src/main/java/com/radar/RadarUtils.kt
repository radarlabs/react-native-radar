package com.radar

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMapKeySetIterator
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

object RadarUtils {

    @Throws(JSONException::class)
    fun mapForJson(obj: JSONObject?): WritableMap? {
        if (obj == null) {
            return null
        }

        val writableMap = WritableNativeMap()
        val iterator = obj.keys()
        while (iterator.hasNext()) {
            val key = iterator.next()
            val value = obj.get(key)
            when (value) {
                is JSONObject -> writableMap.putMap(key, mapForJson(value))
                is JSONArray -> writableMap.putArray(key, arrayForJson(value))
                is Boolean -> writableMap.putBoolean(key, value)
                is Int -> writableMap.putInt(key, value)
                is Double -> writableMap.putDouble(key, value)
                is Float -> {
                    val valueStr = value.toString()
                    val valueDouble = valueStr.toDouble()
                    writableMap.putDouble(key, valueDouble)
                }
                is String -> writableMap.putString(key, value)
            }
        }
        return writableMap
    }

    @Throws(JSONException::class)
    fun arrayForJson(arr: JSONArray?): WritableArray? {
        if (arr == null) {
            return null
        }

        val writableArr = WritableNativeArray()
        for (i in 0 until arr.length()) {
            val value = arr.get(i)
            when (value) {
                is JSONObject -> writableArr.pushMap(mapForJson(value))
                is JSONArray -> writableArr.pushArray(arrayForJson(value))
                is Boolean -> writableArr.pushBoolean(value)
                is Int -> writableArr.pushInt(value)
                is Double -> writableArr.pushDouble(value)
                is String -> writableArr.pushString(value)
            }
        }
        return writableArr
    }

    @Throws(JSONException::class)
    fun jsonForMap(readableMap: ReadableMap?): JSONObject? {
        if (readableMap == null) {
            return null
        }

        val obj = JSONObject()
        val iterator = readableMap.keySetIterator()
        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()
            when (readableMap.getType(key)) {
                com.facebook.react.bridge.ReadableType.Null -> obj.put(key, JSONObject.NULL)
                com.facebook.react.bridge.ReadableType.Boolean -> obj.put(key, readableMap.getBoolean(key))
                com.facebook.react.bridge.ReadableType.Number -> obj.put(key, readableMap.getDouble(key))
                com.facebook.react.bridge.ReadableType.String -> obj.put(key, readableMap.getString(key))
                com.facebook.react.bridge.ReadableType.Map -> obj.put(key, jsonForMap(readableMap.getMap(key)))
                com.facebook.react.bridge.ReadableType.Array -> obj.put(key, jsonForArray(readableMap.getArray(key)))
            }
        }
        return obj
    }

    @Throws(JSONException::class)
    fun jsonForArray(readableArr: ReadableArray?): JSONArray? {
        if (readableArr == null) {
            return null
        }

        val arr = JSONArray()
        for (i in 0 until readableArr.size()) {
            when (readableArr.getType(i)) {
                com.facebook.react.bridge.ReadableType.Null -> {
                    // Skip null values
                }
                com.facebook.react.bridge.ReadableType.Boolean -> arr.put(readableArr.getBoolean(i))
                com.facebook.react.bridge.ReadableType.Number -> arr.put(readableArr.getDouble(i))
                com.facebook.react.bridge.ReadableType.String -> arr.put(readableArr.getString(i))
                com.facebook.react.bridge.ReadableType.Map -> arr.put(jsonForMap(readableArr.getMap(i)))
                com.facebook.react.bridge.ReadableType.Array -> arr.put(jsonForArray(readableArr.getArray(i)))
            }
        }
        return arr
    }

    fun stringArrayForArray(readableArr: ReadableArray?): Array<String> {
        return if (readableArr != null) {
            val size = readableArr.size()
            Array(size) { i -> readableArr.getString(i) ?: "" }
        } else {
            emptyArray()
        }
    }

    fun stringStringMap(readableMap: ReadableMap?): Map<String, String>? {
        if (readableMap == null) {
            return null
        }

        val stringMap = mutableMapOf<String, String>()
        val iterator = readableMap.keySetIterator()
        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()
            val value = readableMap.getString(key)
            if (value != null) {
                stringMap[key] = value
            }
        }
        return stringMap
    }
}
