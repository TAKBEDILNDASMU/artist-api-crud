import { logger } from "../apps/logging.js";
import { ResponseError } from "../errors/response-error.js";

const errorMiddleware = (err, req, res, next) => {
  if (!err) {
    next();
    return;
  } else {
    if (err instanceof ResponseError) {
      res
        .status(err.status)
        .json({
          error: err.message,
        })
        .end();
    } else {
      logger.warn(err.message);
      res.status(500).json({
        error: "Something wrong with my server",
      }).end;
    }
  }
};

export { errorMiddleware };
