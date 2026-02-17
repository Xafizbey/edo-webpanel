export type DocumentStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'ARCHIVED';

export type DocumentType = 'LEAVE_REQUEST' | 'BUSINESS_TRIP' | 'PURCHASE_REQUEST';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'USER' | 'APPROVER' | 'ADMIN';
  department: string;
}

export interface DocumentItem {
  id: string;
  type: DocumentType;
  title: string;
  status: DocumentStatus;
  authorId: string;
  bodyJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  author?: User;
}

export interface PagedDocuments {
  items: DocumentItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
