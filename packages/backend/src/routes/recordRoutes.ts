import { Router } from "express";
import { RecordController } from "../controllers/recordController";

const router = Router();
const recordController = new RecordController();

router.get("/", (req, res) => recordController.getAllRecords(req, res));
router.post("/", (req, res) => recordController.createRecord(req, res));

export default router;
