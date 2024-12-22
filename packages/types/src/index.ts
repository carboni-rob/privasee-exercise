export interface RecordOut {
  _recordId?: number;
  companyName: string;
  _companyId: number;
  question: string;
  answer?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  assignedTo?: string;
  properties: string;
  questionDescription?: string;
}

export interface RecordIn {
  question: string;
  answer?: string;
  createdBy: string;
  updatedBy: string;
  assignedTo: string;
  properties: string;
  questionDescription?: string;
}

export interface PropertyPair {
  key: string;
  value: string;
}
