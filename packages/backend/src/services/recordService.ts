import { RecordFilters, RecordIn, RecordOut } from "@privasee/types";
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

  public async getAllRecords(filters?: RecordFilters): Promise<RecordOut[]> {
    try {
      console.log("Fetching records with filters:", filters);

      let filterFormula = "";

      if (filters) {
        const conditions = [];

        // Filter by assigned users
        if (filters.assignedTo && filters.assignedTo.length > 0) {
          const assigneeConditions = filters.assignedTo.map(
            (email) => `{assignedTo} = '${email}'`
          );
          conditions.push(`OR(${assigneeConditions.join(",")})`);
        }

        // Search in question or description
        if (filters.searchQuery) {
          conditions.push(
            `OR(
              SEARCH(LOWER('${filters.searchQuery}'), LOWER({question})),
              SEARCH(LOWER('${filters.searchQuery}'), LOWER({answer}))
            )`
          );
        }

        // Combine all conditions with AND
        if (conditions.length > 0) {
          filterFormula = `AND(${conditions.join(",")})`;
        }
      }

      const selectConfig: any = {
        sort: [{ field: "_recordId", direction: "desc" }],
      };

      if (filterFormula) {
        selectConfig.filterByFormula = filterFormula;
      }

      const records = await airtable("questions_answers")
        .select(selectConfig)
        .all();

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

  public async getRecord(recordId: number): Promise<RecordOut> {
    const records = await airtable("questions_answers")
      .select({
        filterByFormula: `{_recordId} = ${recordId}`,
      })
      .firstPage();

    if (!records || records.length === 0) {
      throw new Error(`Record not found: ${recordId}`);
    }

    const record = records[0];
    return {
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
    };
  }

  public async updateRecord(
    recordId: number,
    updates: RecordOut
  ): Promise<RecordOut> {
    try {
      console.log(`Updating record ${recordId} with:`, updates);

      // Find the record in Airtable
      const records = await airtable("questions_answers")
        .select({
          filterByFormula: `{_recordId} = ${recordId}`,
        })
        .firstPage();

      if (!records || records.length === 0) {
        throw new Error(`Record with ID ${recordId} not found`);
      }

      const record = records[0];

      // Prepare update data
      const { _recordId, createdAt, updatedAt, ...dataToUpdate } = updates;

      // If properties is an array, convert to string
      if (Array.isArray(dataToUpdate.properties)) {
        dataToUpdate.properties = dataToUpdate.properties
          .map((prop) => `${prop.key}:${prop.value}`)
          .join(",");
      }

      // Update the record in Airtable
      const [updatedRecord] = await airtable("questions_answers").update([
        {
          id: record.id,
          fields: dataToUpdate,
        },
      ]);

      if (!updatedRecord) {
        throw new Error("Failed to update record");
      }

      // Return the updated record
      return {
        _recordId: updatedRecord.get("_recordId") as number,
        companyName: updatedRecord.get("companyName") as string,
        _companyId: updatedRecord.get("_companyId") as number,
        question: updatedRecord.get("question") as string,
        answer: updatedRecord.get("answer") as string,
        createdAt: updatedRecord.get("createdAt") as string,
        createdBy: updatedRecord.get("createdBy") as string,
        updatedAt: updatedRecord.get("updatedAt") as string,
        updatedBy: updatedRecord.get("updatedBy") as string,
        assignedTo: updatedRecord.get("assignedTo") as string,
        properties: updatedRecord.get("properties") as string,
        questionDescription: updatedRecord.get("questionDescription") as string,
      };
    } catch (error) {
      console.error("Error updating record:", error);
      throw error;
    }
  }

  public async deleteRecord(recordId: number): Promise<void> {
    try {
      console.log(`Deleting record ${recordId}`);

      // Find the record in Airtable
      const records = await airtable("questions_answers")
        .select({
          filterByFormula: `{_recordId} = ${recordId}`,
        })
        .firstPage();

      if (!records || records.length === 0) {
        throw new Error(`Record with ID ${recordId} not found`);
      }

      // Delete the record
      await airtable("questions_answers").destroy([records[0].id]);
    } catch (error) {
      console.error("Error deleting record:", error);
      throw error;
    }
  }

  public async bulkAssign(
    recordIds: number[],
    assignedTo: string,
    updatedBy: string
  ): Promise<void> {
    try {
      console.log(
        `Bulk assigning records ${recordIds.join(", ")} to ${assignedTo}`
      );

      // Fetch all records that match the IDs
      const records = await airtable("questions_answers")
        .select({
          filterByFormula: `OR(${recordIds
            .map((id) => `{_recordId} = ${id}`)
            .join(",")})`,
        })
        .all();

      if (!records || records.length === 0) {
        throw new Error("No records found for the provided IDs");
      }

      // Update each record with the new assignee
      const updates = records.map((record) => ({
        id: record.id,
        fields: {
          assignedTo,
        },
      }));

      await airtable("questions_answers").update(updates);
    } catch (error) {
      console.error("Error bulk assigning records:", error);
      throw error;
    }
  }
}
