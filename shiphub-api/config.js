const portValue = process.env.PORT ?? '3000';
const PORT = Number(portValue);

if (
  !Number.isInteger(PORT) ||
  PORT < 1 ||
  PORT > 65535
) {
  throw new Error(`Invalid PORT: ${portValue}`);
}

const allowedLogLevels = ['debug', 'info', 'warn', 'error'];
const LOG_LEVEL = (process.env.LOG_LEVEL ?? 'info').toLowerCase();

if (!allowedLogLevels.includes(LOG_LEVEL)) {
  throw new Error(`Invalid LOG_LEVEL: ${LOG_LEVEL}`);
}

export { PORT, LOG_LEVEL };