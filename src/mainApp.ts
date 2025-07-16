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



const allowedOrigins = [
  'https://joy-mart.vercel.app',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // very important!



app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Joy Mart Server is Running");
});

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
