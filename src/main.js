import { web } from "./apps/web.js";
import { logger } from "./apps/logging.js";

web.listen(3000, () => {
  logger.info("Server up and running on port 3000");
});
