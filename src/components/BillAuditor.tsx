import React, { useState, useEffect } from 'react';
import { BillItem } from '../types';
import { BillInput } from './BillInput';

interface BillAuditorProps {
  onSave: (items: BillItem[]) => void;
  initialBills?: BillItem[];
  onClose: () => void;
}

export const BillAuditor: React.FC<BillAuditorProps> = ({ onSave, initialBills = [], onClose }) => {
  const [billItems, setBillItems] = useState<BillItem[]>(initialBills);

  useEffect(() => {
    const savedBills = localStorage.getItem('billItems');
    if (savedBills) {
      try {
        const parsed = JSON.parse(savedBills);
        setBillItems(parsed);
        onSave(parsed);
      } catch (e) {
        console.error('Error loading saved bills:', e);
      }
    }
  }, []);

  const handleSave = (items: BillItem[]) => {
    setBillItems(items);
    localStorage.setItem('billItems', JSON.stringify(items));
    onSave(items);
    onClose(); // Close the modal after saving
  };

  return (
    <div className="bill-auditor">
      <h2>Medical Bills</h2>
      <div className="bill-input-section">
        <BillInput 
          onSubmit={handleSave}
          initialItems={billItems}
        />
      </div>
    </div>
  );
}; 