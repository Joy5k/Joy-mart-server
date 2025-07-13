import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import admin from 'firebase-admin';
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";


const serviceAccount = require('../joy-mart-client-firebase-adminsdk-fbsvc-400c9c8862.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Joy Mart Server is Running");
});

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
