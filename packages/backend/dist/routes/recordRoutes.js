"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recordController_1 = require("../controllers/recordController");
const router = (0, express_1.Router)();
const recordController = new recordController_1.RecordController();
router.post("/", (req, res) => recordController.createRecord(req, res));
exports.default = router;
