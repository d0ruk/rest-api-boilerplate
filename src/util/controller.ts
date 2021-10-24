import { NextFunction, Request, Response } from "express";

export type handlerFn = (req: Request, res: Response) => Promise<any>;

export interface IHandlerContext {
  req?: Request;
  res?: Response;
}

export const makeController =
  (handler: handlerFn) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler.call({ req, res });
    } catch (error) {
      next(error);
    }
  };
