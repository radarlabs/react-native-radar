package com.radar

import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.*
import org.junit.Test

class EventPayloadTest {
    @Test fun preservesLargeWholeDoublesAndExistingUnsupportedValueBehavior() {
        val original = JSONObject()
            .put("wholeDouble", 1000000000000.0)
            .put("longSkippedByRadarUtils", 1000000000000L)
            .put("float", 1.25f)
            .put("nullSkippedByRadarUtils", JSONObject.NULL)
            .put("array", JSONArray().put(1.25f).put(2).put(1000000000000.0))
        val restored = EventPayload.restore(EventPayload.snapshot(original))
        assertEquals(1000000000000.0, restored.get("wholeDouble"))
        assertFalse(restored.has("longSkippedByRadarUtils"))
        assertFalse(restored.has("nullSkippedByRadarUtils"))
        assertEquals(1.25, restored.get("float"))
        assertEquals(2, restored.getJSONArray("array").length())
        assertEquals(1000000000000.0, restored.getJSONArray("array").get(1))
    }

    @Test fun snapshotsNestedObjectsAndKeepsStringPayloadsAsStrings() {
        val child = JSONObject().put("message", "before")
        val original = JSONObject().put("child", child).put("location", "{\"latitude\":1}")
        val snapshot = EventPayload.snapshot(original)
        child.put("message", "after")
        val restored = EventPayload.restore(snapshot)
        assertEquals("before", restored.getJSONObject("child").getString("message"))
        assertEquals("{\"latitude\":1}", restored.get("location"))
        restored.getJSONObject("child").put("message", "changed on emit")
        assertEquals("before", EventPayload.restore(snapshot).getJSONObject("child").getString("message"))
    }
}
