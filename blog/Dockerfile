FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy pre-built JAR
COPY target/*.jar app.jar

# Create directories for config and keys
RUN mkdir -p /config /keys

# Set environment variables
ENV SPRING_CONFIG_LOCATION=file:/config/,classpath:/
ENV SPRING_PROFILES_ACTIVE=docker

EXPOSE 8083

# Run with Docker profile
ENTRYPOINT ["java", "-jar", "app.jar"]