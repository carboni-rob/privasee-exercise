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

  public async getRecord(req: Request, res: Response): Promise<void> {
    try {
      const recordId = parseInt(req.params.id);
      const record = await this.recordService.getRecord(recordId);
      res.json(record);
    } catch (error) {
      console.error("Error retrieving record:", error);
      res.status(500).json({
        error: "Failed to retrieve record",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async updateRecord(req: Request, res: Response): Promise<void> {
    try {
      const recordId = parseInt(req.params.id);
      if (isNaN(recordId)) {
        res.status(400).json({ error: "Invalid record ID" });
        return;
      }

      const record = await this.recordService.updateRecord(recordId, req.body);
      res.status(200).json(record);
    } catch (error) {
      console.error("Error updating record:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({
          error: "Record not found",
          details: error.message,
        });
      } else {
        res.status(500).json({
          error: "Failed to update record",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
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

  public async deleteRecord(req: Request, res: Response): Promise<void> {
    try {
      const recordId = parseInt(req.params.id);
      if (isNaN(recordId)) {
        res.status(400).json({ error: "Invalid record ID" });
        return;
      }

      await this.recordService.deleteRecord(recordId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting record:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({
          error: "Record not found",
          details: error.message,
        });
      } else {
        res.status(500).json({
          error: "Failed to delete record",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }

  public async bulkAssign(req: Request, res: Response): Promise<void> {
    try {
      const { recordIds, assignedTo, updatedBy } = req.body;

      if (!Array.isArray(recordIds) || recordIds.length === 0) {
        res
          .status(400)
          .json({ error: "Record IDs must be provided as an array" });
        return;
      }

      if (!assignedTo) {
        res.status(400).json({ error: "assignedTo must be provided" });
        return;
      }

      if (!updatedBy) {
        res.status(400).json({ error: "updatedBy must be provided" });
        return;
      }

      await this.recordService.bulkAssign(recordIds, assignedTo, updatedBy);
      res.status(200).json({ message: "Records updated successfully" });
    } catch (error) {
      console.error("Error bulk assigning records:", error);
      res.status(500).json({
        error: "Failed to update records",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
