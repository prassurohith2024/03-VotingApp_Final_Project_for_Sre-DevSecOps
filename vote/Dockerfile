# Use the official lightweight Python 3.11 slim image as the base stage
FROM python:3.11-slim AS base

# Update package lists, install curl (needed for health checks or other tools), 
# then clean up apt cache to keep image size small
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/local/app

# Copy the requirements.txt file into the working directory
COPY requirements.txt ./

# Install Python dependencies from requirements.txt using pip
RUN pip install --no-cache-dir -r requirements.txt

# Development stage for faster feedback and live reload support
FROM base AS dev

# Install watchdog for automatic reloading on file changes
RUN pip install watchdog

# Set environment variable to enable Flask development mode
ENV FLASK_ENV=development

# Default command to run the Flask app in development mode
CMD ["python", "app.py"]

# Final production stage: starts from base image and adds app code and instrumentation
FROM base AS final

# Copy the full application code into the container
COPY . .

# Run OpenTelemetry bootstrap to automatically patch libraries for instrumentation
RUN opentelemetry-bootstrap --action=install

# Expose port 80 for the application
EXPOSE 80

# Set environment variables to configure OpenTelemetry exporters and service name
ENV OTEL_LOGS_EXPORTER="otlp"                        # Export logs using OTLP protocol
ENV OTEL_METRICS_EXPORTER="otlp"                     # Export metrics using OTLP protocol
ENV OTEL_TRACES_EXPORTER="otlp"                      # Export traces using OTLP protocol
ENV OTEL_EXPORTER_OTLP_ENDPOINT="localhost:4317"    # OTLP collector endpoint (adjust in Kubernetes)
ENV OTEL_SERVICE_NAME=vote-service                   # Service name reported in telemetry

# Final command: run the Gunicorn server wrapped with OpenTelemetry instrumentation
CMD ["opentelemetry-instrument", "gunicorn", "app:app", "-b", "0.0.0.0:80", "--log-file", "-", "--access-logfile", "-", "--workers", "4", "--keep-alive", "0"]
