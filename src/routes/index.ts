import indexRoute from "./index.route";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import postRoute from "./post.route";
import tagRoute from "./tag.route";

export default {
  "/": indexRoute,
  "/user": userRoute,
  "/auth": authRoute,
  "/post": postRoute,
  "/tag": tagRoute,
};
