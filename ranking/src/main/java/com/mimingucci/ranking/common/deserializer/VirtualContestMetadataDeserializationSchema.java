package com.mimingucci.ranking.common.deserializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import org.apache.flink.api.common.serialization.DeserializationSchema;
import org.apache.flink.api.common.typeinfo.TypeInformation;

import java.io.IOException;

public class VirtualContestMetadataDeserializationSchema implements DeserializationSchema<VirtualContestMetadata> {
    private static final ObjectMapper mapper = new ObjectMapper();
    static {
        mapper.registerModule(new JavaTimeModule());
        // Optional: if your Instant is being serialized as a timestamp string, this prevents errors
        mapper.findAndRegisterModules(); // registers all found modules, including JavaTimeModule
    }
    public VirtualContestMetadata deserialize(byte[] bytes) throws IOException {
        return mapper.readValue(bytes, VirtualContestMetadata.class);
    }

    public boolean isEndOfStream(VirtualContestMetadata nextElement) { return false; }

    public TypeInformation<VirtualContestMetadata> getProducedType() {
        return TypeInformation.of(VirtualContestMetadata.class);
    }

}
