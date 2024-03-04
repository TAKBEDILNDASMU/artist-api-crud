import express from "express";
import { router } from "../routes/api.js";
import { errorMiddleware } from "../middlewares/error-middleware.js";

export const web = express();

web.use(express.json());
web.use(router);

web.use(errorMiddleware);
web.use((req, res) => {
  res.status(404).json({
    error: "Page not found",
  });
});
