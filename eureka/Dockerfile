FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy pre-built JAR from local machine
COPY target/*.jar app.jar

# Create a directory for external config
RUN mkdir -p /config

# Set environment variable to look for config in /config directory
ENV SPRING_CONFIG_LOCATION=file:/config/,classpath:/

EXPOSE 8761

# Run with external config directory mounted
ENTRYPOINT ["java", "-jar", "app.jar"]