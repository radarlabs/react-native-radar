package com.radar

import org.json.JSONArray
import org.json.JSONObject

internal object EventPayload {
    // Match RadarUtils before saving, so JSON does not change which fields JS receives.
    fun snapshot(value: JSONObject): String = copyObject(value, false).toString()

    // JSON can turn a whole-number Double into a Long, which RadarUtils skips.
    fun restore(value: String): JSONObject = copyObject(JSONObject(value), true)

    private fun copyObject(value: JSONObject, restoring: Boolean): JSONObject {
        val result = JSONObject()
        value.keys().forEach { key ->
            copyValue(value.get(key), restoring, false)?.let { result.put(key, it) }
        }
        return result
    }

    private fun copyValue(value: Any, restoring: Boolean, inArray: Boolean): Any? =
        when (value) {
            is JSONObject -> copyObject(value, restoring)
            is JSONArray -> JSONArray().apply {
                for (index in 0 until value.length()) {
                    copyValue(value.get(index), restoring, true)?.let { put(it) }
                }
            }
            is String, is Boolean, is Int, is Double -> value
            is Float -> if (inArray) null else value.toString().toDouble()
            is Long -> if (restoring) value.toDouble() else null
            else -> null
        }
}
