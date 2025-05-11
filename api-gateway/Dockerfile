FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy pre-built JAR from local machine
COPY target/*.jar app.jar

# Create directories for config and keys
RUN mkdir -p /config /keys

# Set environment variables
ENV SPRING_CONFIG_LOCATION=file:/config/,classpath:/
ENV SPRING_PROFILES_ACTIVE=docker

EXPOSE 8080

# Run with Docker profile activated
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]
