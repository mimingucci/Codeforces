FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy pre-built JAR
COPY target/*.jar app.jar

# Create directories for config and keys
RUN mkdir -p /config /keys /tmp/flink-checkpoints

# Set environment variables
ENV SPRING_CONFIG_LOCATION=file:/config/,classpath:/
ENV SPRING_PROFILES_ACTIVE=docker

EXPOSE 8089

# Add the required JVM args to handle reflection and also improve network connectivity
ENTRYPOINT ["java", \
  "--add-opens=java.base/java.lang=ALL-UNNAMED", \
  "--add-opens=java.base/java.util=ALL-UNNAMED", \
  "--add-opens=java.base/java.util.concurrent=ALL-UNNAMED", \
  "--add-opens=java.base/sun.nio.ch=ALL-UNNAMED", \
  "-Djdk.tls.client.protocols=TLSv1.2", \
  "-Djava.net.preferIPv4Stack=true", \
  "-Dserver.tomcat.basedir=/tmp", \
  "-jar", "app.jar"]