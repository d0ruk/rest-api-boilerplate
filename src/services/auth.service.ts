import { IHandlerContext, errors } from "util/";
import { UserEntity } from "database";

export default {
  async login(this: IHandlerContext) {
    const { email, password } = this.req!.body;

    const user = await UserEntity.scope("all").findByEmail(email);

    if (!user) throw errors.notFound("User not found");

    if (await user.comparePassword(password)) {
      const token = await user.getToken();

      this.res!.status(200).json({ token });
    } else {
      throw errors.badData("Wrong password");
    }
  },
};
