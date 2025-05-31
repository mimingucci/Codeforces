FROM eclipse-temurin:21-jre

WORKDIR /app

# Install Perl and other dependencies for MOSS
RUN apt-get update && \
    apt-get install -y perl curl && \
    rm -rf /var/lib/apt/lists/*

# Copy pre-built JAR
COPY target/*.jar app.jar

# Copy MOSS script and make it executable
COPY moss /app/moss
RUN chmod +x /app/moss

# Create directories for config, keys, and temp files
RUN mkdir -p /config /keys /tmp/moss

# Set environment variables
ENV SPRING_CONFIG_LOCATION=file:/config/,classpath:/
ENV SPRING_PROFILES_ACTIVE=docker

EXPOSE 8087

# Run with Docker profile
ENTRYPOINT ["java", "-jar", "app.jar"]