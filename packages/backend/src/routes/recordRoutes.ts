import { Router } from "express";
import { RecordController } from "../controllers/recordController";

const router = Router();
const recordController = new RecordController();

router.post("/", (req, res) => recordController.createRecord(req, res));

export default router;
