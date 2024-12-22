import { Request, Response } from "express";
import { RecordService } from "../services/recordService";

export class RecordController {
  private recordService: RecordService;

  constructor() {
    this.recordService = RecordService.getInstance();
  }

  public async createRecord(req: Request, res: Response): Promise<void> {
    try {
      const record = await this.recordService.createRecord({
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyName: "Test Company", // As per requirements
        _companyId: Math.floor(Math.random() * 1000000), // Random company ID
      });

      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating record:", error);
      res.status(500).json({
        error: "Failed to create record",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async getAllRecords(req: Request, res: Response): Promise<void> {
    try {
      const records = await this.recordService.getAllRecords();
      res.status(200).json(records);
    } catch (error) {
      console.error("Error fetching records:", error);
      res.status(500).json({
        error: "Failed to fetch records",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
