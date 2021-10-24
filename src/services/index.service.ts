import Boom from "@hapi/boom";

import { IHandlerContext } from "util/";

export default {
  async root(this: IHandlerContext) {
    this.res!.status(200).json(process.env);
  },
  async teapot() {
    throw Boom.teapot();
  },
};
