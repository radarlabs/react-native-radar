package com.radar

internal class StartupEventQueue(
    private val maxEntries: Int = 256,
    private val maxBytes: Int = 1024 * 1024,
) {
    data class Event(val name: String, val payload: String) {
        val bytes = payload.toByteArray(Charsets.UTF_8).size
    }

    private val events = mutableListOf<Event>()
    private val listeners = mutableMapOf<String, Int>()
    private var bytes = 0
    private var startup = true
    private var tracking = false
    private var initialized = false
    private var emitterReady = false
    private var owner = false
    private var closed = false
    private var accepting = true

    // The module shares this lock with teardown so an emit cannot outlive its owner.
    val lock = Any()

    fun claim() = synchronized(lock) { if (!closed) owner = true }
    fun beginInitialization() = synchronized(lock) {
        initialized = false
        accepting = !closed
    }
    fun abortInitialization() = synchronized(lock) {
        initialized = false
        owner = false
        accepting = false
        events.clear()
        bytes = 0
    }
    fun initialized() = synchronized(lock) {
        initialized = true
        finishStartup()
    }
    fun emitterReady() = synchronized(lock) {
        emitterReady = true
        finishStartup()
    }
    private fun finishStartup() {
        if (initialized && emitterReady) startup = false
    }
    fun listenerCount(name: String, count: Int) = synchronized(lock) {
        tracking = true
        listeners[name] = count.coerceAtLeast(0)
    }

    // Strings keep SDK objects and mutable React Native maps out of the backlog.
    fun submit(name: String, payload: String): Boolean = synchronized(lock) {
        if (closed || !accepting || (!startup && tracking && (listeners[name] ?: 0) == 0)) return false
        val event = Event(name, payload)
        if (event.bytes > maxBytes) return true
        var overflow = false
        while (events.isNotEmpty() && (events.size >= maxEntries || bytes + event.bytes > maxBytes)) {
            bytes -= events.removeAt(0).bytes
            overflow = true
        }
        events.add(event)
        bytes += event.bytes
        overflow
    }

    fun drain(emit: (Event) -> Unit) = synchronized(lock) {
        if (closed || !owner || !initialized || !emitterReady) return
        while (!closed && owner && initialized && emitterReady) {
            val index = events.indexOfFirst { !tracking || (listeners[it.name] ?: 0) > 0 }
            if (index < 0) break
            val event = events.removeAt(index)
            bytes -= event.bytes
            emit(event)
        }
    }

    fun close() = synchronized(lock) {
        closed = true
        owner = false
        events.clear()
        listeners.clear()
        bytes = 0
    }
}
