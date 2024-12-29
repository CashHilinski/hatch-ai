export interface BillItem {
  code: string;
  description: string;
  amount: number;
  standardRate?: number;
  concern?: string;
  severity: 'high' | 'medium' | 'low' | 'none';
}

export interface BillAuditResult {
  totalBilled: number;
  standardTotal: number;
  potentialSavings: number;
  concerns: Array<{
    item: BillItem;
    reason: string;
    recommendation: string;
  }>;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  planType: string;
  deductible: string;
  copay: string;
  additionalInfo: string;
}

export interface TreatmentDetails {
  description: string;
  date: string;
  provider: string;
  location: string;
  wasEmergency: boolean;
  symptoms: string;
  diagnosis: string;
  followupNeeded: boolean;
} 