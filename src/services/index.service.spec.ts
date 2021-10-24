import { getMockReq, getMockRes } from "@jest-mock/express";

import { IHandlerContext } from "util/";
import service from "./index.service";

const ctx: IHandlerContext = {};

describe("index.service", () => {
  beforeEach(() => {
    ctx.res = getMockRes().res;
  });

  it("root() returns process.env", async () => {
    await service.root.call(ctx);

    expect(ctx.res?.json).toHaveBeenCalledWith(
      expect.objectContaining(process.env)
    );
    expect(ctx.res?.json).toHaveBeenCalledTimes(1);
  });

  it("teapot() throws 418", async () => {
    try {
      await service.teapot.call({});
    } catch (error) {
      expect(error.output.statusCode).toBe(418);
    }
  });
});
