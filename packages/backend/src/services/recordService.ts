import { RecordIn, RecordOut } from "@privasee/types";
import { airtable } from "../config/airtable";

export class RecordService {
  private static instance: RecordService;
  private constructor() {}

  public static getInstance(): RecordService {
    if (!RecordService.instance) {
      RecordService.instance = new RecordService();
    }
    return RecordService.instance;
  }

  public async getAllRecords(): Promise<RecordOut[]> {
    try {
      console.log("Fetching all records from Airtable...");

      const records = await airtable("questions_answers")
        .select({
          sort: [{ field: "_recordId", direction: "desc" }],
        })
        .all();

      console.log(`Found ${records.length} records`);

      return records.map((record) => ({
        _recordId: record.get("_recordId") as number,
        companyName: record.get("companyName") as string,
        _companyId: record.get("_companyId") as number,
        question: record.get("question") as string,
        answer: record.get("answer") as string,
        createdAt: record.get("createdAt") as string,
        createdBy: record.get("createdBy") as string,
        updatedAt: record.get("updatedAt") as string,
        updatedBy: record.get("updatedBy") as string,
        assignedTo: record.get("assignedTo") as string,
        properties: record.get("properties") as string,
        questionDescription: record.get("questionDescription") as string,
      }));
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    }
  }

  public async createRecord(record: RecordIn): Promise<RecordIn> {
    await airtable("questions_answers").create({
      question: record.question,
      answer: record.answer || "",
      createdBy: record.createdBy,
      updatedBy: record.updatedBy,
      assignedTo: record.assignedTo,
      properties: record.properties,
      questionDescription: record.questionDescription || "",
    });

    return {
      ...record,
    };
  }
}
