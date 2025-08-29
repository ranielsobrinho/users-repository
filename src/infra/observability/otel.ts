import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { logger } from '@/main/config/pino-logger'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION
} from '@opentelemetry/semantic-conventions'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
})

const metricExporter = new OTLPMetricExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
})

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 125
})

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: '1.0.0'
  }),
  traceExporter: traceExporter,
  metricReader: metricReader,
  instrumentations: [getNodeAutoInstrumentations()]
})

try {
  sdk.start()
  logger.info('Initialized OpenTelemetry SDK successfully')
} catch (error) {
  logger.error(`Failed to initialize OpenTelemetry SDK ${error}`)
}

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => logger.info('OpenTelemetry SDK shut down successfully'))
    .catch((err) => logger.error('Error shutting down SDK', err))
    .finally(() => process.exit(0))
})

export { sdk }
