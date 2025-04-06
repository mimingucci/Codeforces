package com.mimingucci.ranking.common.deserializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mimingucci.ranking.domain.model.ContestMetadata;
import org.apache.flink.api.common.serialization.DeserializationSchema;
import org.apache.flink.api.common.typeinfo.TypeInformation;

import java.io.IOException;

public class ContestMetadataDeserializationSchema implements DeserializationSchema<ContestMetadata> {
    private static final ObjectMapper mapper = new ObjectMapper();
    public ContestMetadata deserialize(byte[] bytes) throws IOException {
        return mapper.readValue(bytes, ContestMetadata.class);
    }

    public boolean isEndOfStream(ContestMetadata nextElement) { return false; }

    public TypeInformation<ContestMetadata> getProducedType() {
        return TypeInformation.of(ContestMetadata.class);
    }
}
