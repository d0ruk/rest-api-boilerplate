import indexRoute from "./index.route";
import userRoute from "./user.route";
import authRoute from "./auth.route";

export default {
  "/": indexRoute,
  "/user": userRoute,
  "/auth": authRoute,
};
