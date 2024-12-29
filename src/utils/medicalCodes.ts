import { BillItem } from '../types';

interface MedicalRate {
  code: string;
  description: string;
  standardRate: number;
  commonConcerns: string[];
}

const MEDICAL_RATES: { [key: string]: MedicalRate } = {
  '99213': {
    code: '99213',
    description: 'Office visit, established patient, 15 minutes',
    standardRate: 130.00,
    commonConcerns: ['upcoding', 'frequency']
  },
  // Add more codes...
};

export const getMedicalRate = (code: string): number | undefined => {
  return MEDICAL_RATES[code]?.standardRate;
};

export const getConcern = (item: BillItem, variance: number): string | undefined => {
  const percentDiff = (variance / (item.standardRate || item.amount)) * 100;
  
  if (percentDiff > 50) {
    return 'Significant overcharge detected';
  }
  
  return undefined;
};

export const getRecommendation = (item: BillItem, variance: number): string | undefined => {
  const percentDiff = (variance / (item.standardRate || item.amount)) * 100;
  
  if (percentDiff > 50) {
    return 'Request itemized bill and negotiate price based on standard rates';
  }
  
  return undefined;
};

export const analyzeBillItem = (
  item: BillItem,
  standardRate: number
): {
  concern?: string;
  severity: 'high' | 'medium' | 'low' | 'none';
  recommendation?: string;
} => {
  const variance = item.amount - standardRate;
  const percentDiff = (variance / standardRate) * 100;

  if (percentDiff > 50) {
    return {
      concern: 'Significant overcharge detected',
      severity: 'high',
      recommendation: 'Request itemized bill and negotiate price based on standard rates'
    };
  }

  return { severity: 'none' };
}; 