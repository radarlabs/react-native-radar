package com.radar

import org.junit.Assert.*
import org.junit.Test
import java.util.concurrent.CountDownLatch
import kotlin.concurrent.thread

class StartupEventQueueTest {
    @Test fun allNineTypesAreRetainedUntilTheirListenersRegister() {
        val queue = StartupEventQueue()
        val names = listOf(
            "eventsEmitter", "locationEmitter", "clientLocationEmitter",
            "errorEmitter", "logEmitter", "tokenEmitter", "newInAppMessageEmitter",
            "inAppMessageDismissedEmitter", "inAppMessageClickedEmitter",
        )
        queue.listenerCount("logEmitter", 0)
        names.forEach { queue.submit(it, "{\"name\":\"$it\"}") }
        ready(queue)
        queue.drain { fail("No listeners") }
        val received = mutableListOf<String>()
        names.reversed().forEach { name ->
            queue.listenerCount(name, 1)
            queue.drain { received.add(it.name) }
        }
        assertEquals(names.reversed(), received)
    }

    @Test fun productionLimitsBoundRetainedEntriesAndPayloadBytes() {
        val queue = StartupEventQueue()
        repeat(256) { assertFalse(queue.submit("a", "x")) }
        assertTrue(queue.submit("a", "last"))
        ready(queue)
        var count = 0
        queue.drain { count++ }
        assertEquals(256, count)

        val byteQueue = StartupEventQueue()
        assertFalse(byteQueue.submit("a", "x".repeat(1024 * 1024)))
        assertTrue(byteQueue.submit("a", "replacement"))
        ready(byteQueue)
        byteQueue.drain { assertEquals("replacement", it.payload) }
    }

    private fun ready(queue: StartupEventQueue) {
        queue.claim()
        queue.initialized()
        queue.emitterReady()
    }

    @Test fun startupWaitsForBothReadinessOrdersAndOwnership() {
        for (emitterFirst in listOf(true, false)) {
            val queue = StartupEventQueue()
            val received = mutableListOf<String>()
            queue.submit("a", "constructor")
            if (emitterFirst) queue.emitterReady() else queue.initialized()
            queue.drain { fail("Not ready") }
            if (emitterFirst) queue.initialized() else queue.emitterReady()
            queue.drain { fail("Not the owner") }
            queue.claim()
            queue.drain { received.add(it.payload) }
            assertEquals(listOf("constructor"), received)
        }
    }

    @Test fun lateListenersDoNotBlockOtherTypesOrLetLiveEventsOvertake() {
        val queue = StartupEventQueue()
        queue.listenerCount("b", 1)
        queue.submit("a", "a1")
        queue.submit("b", "b1")
        queue.submit("a", "a2")
        ready(queue)
        val received = mutableListOf<String>()
        queue.drain { received.add(it.payload) }
        assertEquals(listOf("b1"), received)
        queue.submit("a", "unsubscribed live")
        queue.listenerCount("a", 1)
        queue.submit("a", "a3")
        queue.drain { received.add(it.payload) }
        assertEquals(listOf("b1", "a1", "a2", "a3"), received)
        queue.listenerCount("a", 0)
        queue.submit("a", "removed")
        queue.listenerCount("a", 1)
        queue.drain { fail("Live events without listeners must not accumulate") }
    }

    @Test fun capturesArrivalsDuringInitializationWithoutHoldingQueueLock() {
        val queue = StartupEventQueue()
        queue.claim()
        queue.emitterReady()
        queue.beginInitialization()
        val callback = thread { queue.submit("a", "during init") }
        callback.join(2000)
        assertFalse(callback.isAlive)
        queue.drain { fail("Initialization is incomplete") }
        queue.initialized()
        var count = 0
        queue.drain { count++ }
        assertEquals(1, count)
    }

    @Test fun concurrentArrivalsStayBehindBacklog() {
        val queue = StartupEventQueue()
        queue.submit("a", "first")
        ready(queue)
        val entered = CountDownLatch(1)
        val submitted = CountDownLatch(1)
        val received = mutableListOf<String>()
        val callback = thread {
            entered.await()
            submitted.countDown()
            queue.submit("a", "second")
        }
        queue.drain {
            received.add(it.payload)
            entered.countDown()
            submitted.await()
        }
        callback.join(2000)
        assertFalse(callback.isAlive)
        queue.drain { received.add(it.payload) }
        assertEquals(listOf("first", "second"), received)
    }

    @Test fun evictsOldestByCountAndUtf8BytesAndRejectsOversized() {
        val queue = StartupEventQueue(maxEntries = 2, maxBytes = 5)
        assertFalse(queue.submit("a", "1"))
        assertFalse(queue.submit("b", "2"))
        assertTrue(queue.submit("c", "3"))
        assertTrue(queue.submit("d", "éé"))
        assertTrue(queue.submit("e", "oversized"))
        ready(queue)
        val received = mutableListOf<String>()
        queue.drain { received.add(it.payload) }
        assertEquals(listOf("3", "éé"), received)
    }

    @Test fun serializedSnapshotsAreImmutable() {
        val queue = StartupEventQueue()
        val mutable = StringBuilder("before")
        queue.submit("a", mutable.toString())
        mutable.replace(0, mutable.length, "after")
        ready(queue)
        queue.drain { assertEquals("before", it.payload) }
    }

    @Test fun closeCancelsPendingAndFutureDeliveryEvenAfterReadiness() {
        val queue = StartupEventQueue()
        queue.submit("a", "pending")
        queue.close()
        ready(queue)
        queue.submit("a", "stale")
        queue.drain { fail("Closed queues cannot emit") }
    }

    @Test fun ownershipReplacementClosesOldQueueWithoutClosingReplacement() {
        val old = StartupEventQueue()
        old.submit("a", "old")
        ready(old)
        old.close()
        val replacement = StartupEventQueue()
        replacement.submit("a", "new")
        ready(replacement)
        old.close()
        old.drain { fail("Old owner") }
        replacement.drain { assertEquals("new", it.payload) }
    }

    @Test fun teardownWaitsForCurrentEmissionAndStopsNextEmission() {
        val queue = StartupEventQueue()
        queue.submit("a", "first")
        queue.submit("a", "second")
        ready(queue)
        val received = mutableListOf<String>()
        queue.drain {
            received.add(it.payload)
            queue.close()
        }
        assertEquals(listOf("first"), received)
    }

    @Test fun olderJavascriptWithoutNegotiationStillReceivesEvents() {
        val queue = StartupEventQueue()
        ready(queue)
        queue.submit("a", "live")
        var count = 0
        queue.drain { count++ }
        assertEquals(1, count)
    }

    @Test fun initializationFailureCancelsBacklogButAllowsRetry() {
        val queue = StartupEventQueue()
        queue.submit("a", "before failure")
        queue.abortInitialization()
        queue.submit("a", "after failure")
        queue.beginInitialization()
        queue.submit("a", "retry")
        ready(queue)
        val received = mutableListOf<String>()
        queue.drain { received.add(it.payload) }
        assertEquals(listOf("retry"), received)
    }
}
