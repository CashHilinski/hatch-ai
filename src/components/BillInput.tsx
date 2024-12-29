import React, { useState } from 'react';
import { BillItem } from '../types';

interface BillInputProps {
  onSubmit: (items: BillItem[]) => void;
  initialItems?: BillItem[];
}

export const BillInput: React.FC<BillInputProps> = ({ onSubmit, initialItems = [] }) => {
  const [items, setItems] = useState<BillItem[]>(initialItems);
  const [currentItem, setCurrentItem] = useState<Partial<BillItem>>({
    code: '',
    description: '',
    amount: 0,
    severity: 'none'
  });

  const addItem = () => {
    if (currentItem.code && currentItem.description && currentItem.amount) {
      setItems([...items, currentItem as BillItem]);
      setCurrentItem({
        code: '',
        description: '',
        amount: 0,
        severity: 'none'
      });
    }
  };

  return (
    <div className="bill-input">
      <div className="bill-items-list">
        {items.map((item, index) => (
          <div key={index} className="bill-item">
            <p><strong>{item.description}</strong></p>
            <p>Code: {item.code} - Amount: ${item.amount}</p>
            <button 
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              className="remove-item"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="add-item-form">
        <h3>Add Bill Item</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Medical Code</label>
            <input
              type="text"
              value={currentItem.code}
              onChange={(e) => setCurrentItem({...currentItem, code: e.target.value})}
              placeholder="e.g., 99213"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={currentItem.description}
              onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
              placeholder="e.g., Office Visit"
            />
          </div>
          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              value={currentItem.amount || ''}
              onChange={(e) => setCurrentItem({...currentItem, amount: parseFloat(e.target.value)})}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <button 
          type="button" 
          onClick={addItem}
          className="add-item-button"
          disabled={!currentItem.code || !currentItem.description || !currentItem.amount}
        >
          Add Item
        </button>
      </div>

      <div className="submit-section">
        <button 
          onClick={() => onSubmit(items)}
          disabled={items.length === 0}
          className="save-button"
        >
          Save Bills ({items.length} items)
        </button>
      </div>
    </div>
  );
}; 