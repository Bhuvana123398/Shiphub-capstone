import { HttpError } from './HttpError.js';

export function notFound(req, res, next) {
  next(new HttpError(404, 'Route not found'));
}