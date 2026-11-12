import type { RequestHandler } from "express";

export const stopMiddleware: RequestHandler = (req, res, next) => {
  if ('From' in req.body && req.body.From === '66377') {
    res.status(200).send('STOP');
    return;
  }

  next();
}
