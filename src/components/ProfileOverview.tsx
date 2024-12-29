import React from 'react';
import { BillItem, TreatmentDetails, InsuranceInfo } from '../types';

interface ProfileOverviewProps {
  insuranceInfo: InsuranceInfo | null;
  treatmentInfo: TreatmentDetails;
  billItems: BillItem[];
  onEditInsurance: () => void;
  onEditTreatment: () => void;
  onEditBills: () => void;
  onClose: () => void;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  insuranceInfo,
  treatmentInfo,
  billItems,
  onEditInsurance,
  onEditTreatment,
  onEditBills,
  onClose,
}) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="profile-overlay" onClick={handleOverlayClick}>
      <div className="profile-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Your Healthcare Profile</h2>
        
        <div className="profile-section">
          <div className="section-header">
            <h3>Insurance Information</h3>
            <button onClick={onEditInsurance} className="edit-button">Edit</button>
          </div>
          {insuranceInfo ? (
            <div className="info-grid">
              <div className="info-item">
                <label>Provider:</label>
                <span>{insuranceInfo.provider}</span>
              </div>
              <div className="info-item">
                <label>Plan Type:</label>
                <span>{insuranceInfo.planType}</span>
              </div>
              <div className="info-item">
                <label>Deductible:</label>
                <span>{insuranceInfo.deductible}</span>
              </div>
              <div className="info-item">
                <label>Copay:</label>
                <span>{insuranceInfo.copay}</span>
              </div>
            </div>
          ) : (
            <p className="empty-state">No insurance information added yet</p>
          )}
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3>Treatment Details</h3>
            <button onClick={onEditTreatment} className="edit-button">Edit</button>
          </div>
          {treatmentInfo.description ? (
            <div className="info-grid">
              <div className="info-item">
                <label>Description:</label>
                <span>{treatmentInfo.description}</span>
              </div>
              <div className="info-item">
                <label>Date:</label>
                <span>{treatmentInfo.date}</span>
              </div>
              <div className="info-item">
                <label>Provider:</label>
                <span>{treatmentInfo.provider}</span>
              </div>
              <div className="info-item">
                <label>Location:</label>
                <span>{treatmentInfo.location}</span>
              </div>
            </div>
          ) : (
            <p className="empty-state">No treatment details added yet</p>
          )}
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3>Medical Bills</h3>
            <button onClick={onEditBills} className="edit-button">Edit</button>
          </div>
          {billItems.length > 0 ? (
            <div className="bills-list">
              {billItems.map((item, index) => (
                <div key={index} className="bill-item">
                  <span className="bill-description">{item.description}</span>
                  <span className="bill-amount">${item.amount}</span>
                </div>
              ))}
              <div className="bill-total">
                <strong>Total:</strong>
                <span>${billItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <p className="empty-state">No bills added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}; 