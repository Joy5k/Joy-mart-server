import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import admin from 'firebase-admin';
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";


const serviceAccount = require('../notification-secrete.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
const app: Application = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    // origin: ['https://joy-mart.vercel.app'],
        origin: ['http://localhost:3000'],

    credentials: true,
  }),
);
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    // ['https://joy-mart.vercel.app']
    ['http://localhost:3000']
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});



app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Joy Mart Server is Running");
});

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
