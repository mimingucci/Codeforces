package com.mimingucci.ranking.common.deserializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mimingucci.ranking.domain.model.ContestMetadata;
import org.apache.flink.api.common.serialization.DeserializationSchema;
import org.apache.flink.api.common.typeinfo.TypeInformation;

import java.io.IOException;

public class ContestMetadataDeserializationSchema implements DeserializationSchema<ContestMetadata> {
    private static final ObjectMapper mapper = new ObjectMapper();
    static {
        mapper.registerModule(new JavaTimeModule());
        // Optional: if your Instant is being serialized as a timestamp string, this prevents errors
        mapper.findAndRegisterModules(); // registers all found modules, including JavaTimeModule
    }
    public ContestMetadata deserialize(byte[] bytes) throws IOException {
        return mapper.readValue(bytes, ContestMetadata.class);
    }

    public boolean isEndOfStream(ContestMetadata nextElement) { return false; }

    public TypeInformation<ContestMetadata> getProducedType() {
        return TypeInformation.of(ContestMetadata.class);
    }
}
