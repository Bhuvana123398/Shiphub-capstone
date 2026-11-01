import { LOG_LEVEL } from './config.js';

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function log(level, message) {
  if (levels[level] >= levels[LOG_LEVEL]) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  }
}

export const logger = {
  debug: (message) => log('debug', message),
  info: (message) => log('info', message),
  warn: (message) => log('warn', message),
  error: (message) => log('error', message),
};