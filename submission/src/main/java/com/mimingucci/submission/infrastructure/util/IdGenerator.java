package com.mimingucci.submission.infrastructure.util;

import java.security.SecureRandom;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class IdGenerator {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    public static final IdGenerator INSTANCE = new IdGenerator();
    private static final long WORKER_ID_BITS = 5L;
    private static final long DATA_CENTER_ID_BITS = 5L;
    private static final long MAX_WORKER_ID = 31L;
    private static final long MAX_DATA_CENTER_ID = 31L;
    private static final long SEQUENCE_BITS = 12L;
    private static final long WORKER_ID_SHIFT = 12L;
    private static final long DATA_CENTER_ID_SHIFT = 17L;
    private static final long TIMESTAMP_LEFT_SHIFT = 22L;
    private static final long SEQUENCE_MASK = 4095L;
    private final long workerId;
    private final long dataCenterId;
    private final long idEpoch;
    private final Lock lock;
    private long sequence;
    private long lastTimestamp;

    private IdGenerator() {
        this(SECURE_RANDOM.nextInt(31), SECURE_RANDOM.nextInt(31), 1288834974657L);
    }

    private IdGenerator(long workerId, long dataCenterId, long idEpoch) {
        this.lock = new ReentrantLock();
        this.sequence = 48L;
        this.lastTimestamp = -1L;
        if (workerId <= 31L && workerId >= 0L) {
            if (dataCenterId <= 31L && dataCenterId >= 0L) {
                this.workerId = workerId;
                this.dataCenterId = dataCenterId;
                this.idEpoch = idEpoch;
            } else {
                throw new IllegalArgumentException(String.format("datacenter Id can't be greater than %d or less than 0", 31L));
            }
        } else {
            throw new IllegalArgumentException(String.format("worker Id can't be greater than %d or less than 0", 31L));
        }
    }

    public long nextId() {
        this.lock.lock();

        long var3;
        try {
            long timestamp = this.timeGen();
            if (timestamp < this.lastTimestamp) {
                throw new IllegalArgumentException(String.format("Clock moved backwards.  Refusing to generate id for %d milliseconds", this.lastTimestamp - timestamp));
            }

            if (this.lastTimestamp == timestamp) {
                this.sequence = this.sequence + 1L & 4095L;
                if (this.sequence == 0L) {
                    timestamp = this.tilNextMillis(this.lastTimestamp);
                }
            } else {
                this.sequence = 0L;
            }

            this.lastTimestamp = timestamp;
            var3 = timestamp - this.idEpoch << 22 | this.dataCenterId << 17 | this.workerId << 12 | this.sequence;
        } finally {
            this.lock.unlock();
        }

        return var3;
    }

    private long tilNextMillis(long lastTimestamp) {
        long timestamp = timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }

    private long timeGen() {
        return System.currentTimeMillis();
    }

}
