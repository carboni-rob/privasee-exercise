"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordController = void 0;
const recordService_1 = require("../services/recordService");
class RecordController {
    constructor() {
        this.recordService = recordService_1.RecordService.getInstance();
    }
    async createRecord(req, res) {
        try {
            const record = await this.recordService.createRecord({
                ...req.body,
                createdAt: new Date().toISOString(),
                companyName: "Test Company", // As per requirements
                _companyId: Math.floor(Math.random() * 1000000), // Random company ID
            });
            res.status(201).json(record);
        }
        catch (error) {
            console.error("Error creating record:", error);
            res.status(500).json({
                error: "Failed to create record",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.RecordController = RecordController;
