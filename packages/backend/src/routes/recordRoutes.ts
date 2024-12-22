import { Router } from "express";
import { RecordController } from "../controllers/recordController";

const router = Router();
const recordController = new RecordController();

router.get("/", (req, res) => recordController.getAllRecords(req, res));
router.get("/:id", (req, res) => recordController.getRecord(req, res));
router.post("/", (req, res) => recordController.createRecord(req, res));
router.put("/:id", (req, res) => recordController.updateRecord(req, res));
router.patch("/:id", (req, res) => recordController.updateRecord(req, res));
router.delete("/:id", (req, res) => recordController.deleteRecord(req, res));

export default router;
