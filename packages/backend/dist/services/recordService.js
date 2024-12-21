"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordService = void 0;
const airtable_1 = require("../config/airtable");
class RecordService {
    constructor() {
        this.lastRecordId = 0;
    }
    static getInstance() {
        if (!RecordService.instance) {
            RecordService.instance = new RecordService();
        }
        return RecordService.instance;
    }
    async getNextRecordId() {
        if (this.lastRecordId === 0) {
            // Fetch the highest record ID from Airtable
            const records = await (0, airtable_1.airtable)("questions_answers")
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
    async createRecord(record) {
        const recordId = await this.getNextRecordId();
        const airtableRecord = await (0, airtable_1.airtable)("Records").create({
            _recordId: recordId,
            companyName: record.companyName,
            _companyId: record._companyId,
            question: record.question,
            answer: record.answer || "",
            createdAt: record.createdAt,
            createdBy: record.createdBy,
            updatedAt: record.updatedAt || record.createdAt,
            updatedBy: record.updatedBy || record.createdBy,
            assignedTo: record.assignedTo || "",
            properties: record.properties,
            questionDescription: record.questionDescription || "",
        });
        return {
            _recordId: recordId,
            ...record,
        };
    }
}
exports.RecordService = RecordService;
