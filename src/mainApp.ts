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

// CORS configuration
const allowedOrigins = [
  'https://joy-mart.vercel.app',
  'https://joy-mart-git-main-mehedi-hasan-s-projects.vercel.app',
  /^https:\/\/joy-mart-.*-mehedi-hasan-s-projects\.vercel\.app$/,
  /^https:\/\/joy-mart-.*\.vercel\.app$/,
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      // Check if the origin matches any pattern
      if (allowedOrigins.some(pattern => {
        return typeof pattern === 'string' 
          ? origin === pattern
          : pattern.test(origin);
      })) {
        return callback(null, true);
      }
      
      console.error(`CORS blocked for ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-JSON'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Handle preflight requests
app.options('*', cors());


app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Joy Mart Server is Running");
});

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
