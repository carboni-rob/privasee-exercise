export interface User {
  id: string;
  email: string;
  name: string;
}

export interface RecordOut {
  _recordId?: number;
  companyName: string;
  _companyId: number;
  question: string;
  answer?: string;
  createdAt: string;
  createdBy: User;
  updatedAt?: string;
  updatedBy?: User;
  assignedTo?: User;
  properties: string;
  questionDescription?: string;
}

export interface RecordIn {
  question: string;
  answer?: string;
  properties: string;
  questionDescription?: string;
}

export interface PropertyPair {
  key: string;
  value: string;
}
