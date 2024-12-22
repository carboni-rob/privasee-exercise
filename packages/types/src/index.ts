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

export interface Auth0User {
  user_id: string;
  email: string;
  name?: string;
  picture?: string;
  nickname?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  email_verified: boolean;
}
