import { URL } from "node:url";
import { Response, Request, NextFunction } from "express";
import jwt from "express-jwt";
import config from "config";

import { UserEntity } from "database";
import { errors, defineAbilityFor } from "util/";

const { secret, options: jwtOptions } = config.get("app.jwt");

interface IAuthMiddleware {
  skip: Array<{ url: string; method: string }>;
}

const authMiddleware = ({ skip }: IAuthMiddleware = { skip: [] }) => [
  jwt({ secret, algorithms: [jwtOptions.algorithm] }).unless({
    custom: (req: Request): boolean => {
      const { pathname } = new URL(req.url, "https://example.com");

      const found = skip.find(({ method, url }) => {
        return (
          method.toLowerCase() === req.method.toLowerCase() && url === pathname
        );
      });

      return Boolean(found);
    },
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.user?.email;

    if (email) {
      const user = await UserEntity.scope("all").findByEmail(email);

      if (!user) return next(errors.notFound("Bearer not found"));

      req.user = user;
    }

    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    req.ability = defineAbilityFor(req.user);
    next();
  },
];

export default authMiddleware;
