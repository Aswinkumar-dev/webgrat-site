# syntax=docker/dockerfile:1
# ──────────────────────────────────────────────────────────────────────
#  Webgrat backend — Spring Boot 3.5 / Java 17  (deployed on Render)
# ──────────────────────────────────────────────────────────────────────
#  Render build command :  (none — uses this Dockerfile automatically)
#  Render start command :  (none — uses ENTRYPOINT below)
#  Render Dockerfile path:  backend/webgrat-agency-project/Dockerfile
#  Render Docker context :  backend/webgrat-agency-project
# ──────────────────────────────────────────────────────────────────────

# ── 1) Build stage: compile the fat-jar with Maven 3.9 + JDK 17 ───────
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy the POM first so Docker can cache the dependency layer between
# builds where only source files change.
COPY pom.xml ./
RUN mvn -B -q -e -DskipTests dependency:go-offline

# Now the source.
COPY src src
RUN mvn -B -q -DskipTests package \
 && cp target/*.jar app.jar

# ── 2) Runtime stage: small JRE image, non-root user ──────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=build --chown=spring:spring /workspace/app.jar /app/app.jar

# Render injects $PORT; Spring Boot reads it via server.port=${PORT:8080}
# in application.properties, so we just expose the default for clarity.
EXPOSE 8080

# UseContainerSupport + MaxRAMPercentage tunes the JVM heap to fit the
# 512 MB Render free-tier instance without OOM-kills on first request.
ENTRYPOINT ["sh","-c","exec java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75 -jar /app/app.jar"]
