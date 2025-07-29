'use strict';

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Configure the OTLP gRPC exporter (adjust URL if needed)
const traceExporter = new OTLPTraceExporter({
  // url: 'grpc://otel-collector:4317', // Optional: set your collector endpoint
});

// Create a Resource describing this service
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'result-nodejs',
});

// Initialize the OpenTelemetry Node SDK with auto instrumentations
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource,
});

// Start the SDK and catch any startup errors
sdk.start()
  .then(() => {
    console.log('OpenTelemetry SDK started');
  })
  .catch((error) => {
    console.error('Error starting OpenTelemetry SDK', error);
  });

// Handle graceful shutdown on SIGTERM and SIGINT
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry SDK shut down successfully'))
    .catch((error) => console.error('Error during SDK shutdown', error))
    .finally(() => process.exit(0));
});

process.on('SIGINT', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry SDK shut down successfully'))
    .catch((error) => console.error('Error during SDK shutdown', error))
    .finally(() => process.exit(0));
});
