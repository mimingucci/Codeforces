package com.mimingucci.ranking.common.deserializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import org.apache.flink.api.common.serialization.DeserializationSchema;
import org.apache.flink.api.common.typeinfo.TypeInformation;

import java.io.IOException;

public class SubmissionResultEventDeserializationSchema implements DeserializationSchema<SubmissionResultEvent> {
    private static final ObjectMapper mapper = new ObjectMapper();
    public SubmissionResultEvent deserialize(byte[] bytes) throws IOException {
        return mapper.readValue(bytes, SubmissionResultEvent.class);
    }

    public boolean isEndOfStream(SubmissionResultEvent nextElement) { return false; }

    public TypeInformation<SubmissionResultEvent> getProducedType() {
        return TypeInformation.of(SubmissionResultEvent.class);
    }
}
