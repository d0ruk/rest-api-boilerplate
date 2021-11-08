import indexRoute from "./index.route";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import postRoute from "./post.route";

export default {
  "/": indexRoute,
  "/user": userRoute,
  "/auth": authRoute,
  "/post": postRoute,
};
