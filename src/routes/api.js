import express from "express";
import artistController from "../controllers/artist-controller.js";

const router = express.Router();

// artist API
router.get("/artists", artistController.list);
router.get("/artists/page/:page", artistController.listPaging);
router.post("/artists", artistController.create);
router.patch("/artists/:username", artistController.update);
router.get("/artists/:username", artistController.get);
router.delete("/artists/:username", artistController.remove);

export { router };
