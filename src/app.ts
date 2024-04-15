import env from "dotenv";
env.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import PostRoute from "./routes/post_route";
import userRoute from "./routes/user_route";
import authRoute from "./routes/auth_route";
import commentRoute from './routes/comment_route';
import fileRoute from "./routes/file_route";
//import location_route from "./routes/location_route";
import cors from "cors";
//const allowedOrigins = ['http://localhost:5173'];

const initApp = (): Promise<Express> => {

  const promise = new Promise<Express>((resolve) => {
    
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!).then(() => {
      const app = express();
      app.use(bodyParser.json({limit: "50mb"}));
      app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
      // app.use((req, res, next) => {
      //   res.header("Access-Control-Allow-Origin", "*");
      //   res.header("Access-Control-Allow-Methods", "*");
      //   res.header("Access-Control-Allow-Headers", "*");
      //   next();
      // })
      const corsOptions = {
        origin:
          process.env.NODE_ENV !== "production"
            ? `http://${process.env.DOMAIN_BASE}:${process.env.FRONTEND_PORT}`
            : `https://${process.env.DOMAIN_BASE}`,
        credentials: true,
      };
      app.use(cors(corsOptions));

      app.use("/user",userRoute);
      app.use("/userpost", PostRoute);
      app.use("/auth", authRoute);
      app.use("/comments", commentRoute);
      app.use("/file", fileRoute);
    //  app.use("/user-locations", location_route)
      app.use("/public", express.static("public"));
      
      //app.use(cors())
      resolve(app);
    });
  });
  return promise;
};

export default initApp;
