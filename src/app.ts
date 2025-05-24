import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

// application routes
app.use("/api/v1", router);
app.get("/", (req, res) => {
  res.send('Server is running "/", please check "/api/v1"');
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
