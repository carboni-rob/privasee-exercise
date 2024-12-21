import { RecordIn } from "@privasee/types";
import { airtable } from "../config/airtable";

export class RecordService {
  private static instance: RecordService;
  private lastRecordId: number = 0;

  private constructor() {}

  public static getInstance(): RecordService {
    if (!RecordService.instance) {
      RecordService.instance = new RecordService();
    }
    return RecordService.instance;
  }

  private async getNextRecordId(): Promise<number> {
    if (this.lastRecordId === 0) {
      // Fetch the highest record ID from Airtable
      const records = await airtable("questions_answers")
        .select({
          fields: ["_recordId"],
          sort: [{ field: "_recordId", direction: "desc" }],
          maxRecords: 1,
        })
        .firstPage();

      this.lastRecordId = records[0]
        ? Number(records[0].get("_recordId")) || 0
        : 0;
    }

    return ++this.lastRecordId;
  }

  public async createRecord(record: RecordIn): Promise<RecordIn> {
    const airtableRecord = await airtable("questions_answers").create({
      question: record.question,
      answer: record.answer || "",
      properties: record.properties,
      questionDescription: record.questionDescription || "",
    });

    return {
      ...record,
    };
  }
}
