import React, { useState, useEffect } from 'react';

interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  planType: string;
  deductible: string;
  copay: string;
  additionalInfo: string;
}

interface ProfileProps {
  onClose: () => void;
  onSave: (info: InsuranceInfo) => void;
  savedInfo?: InsuranceInfo;
}

export const Profile: React.FC<ProfileProps> = ({ onClose, onSave, savedInfo }) => {
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo>(
    savedInfo || {
      provider: '',
      policyNumber: '',
      planType: '',
      deductible: '',
      copay: '',
      additionalInfo: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(insuranceInfo);
    onClose();
  };

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Insurance Profile</h2>
        <p className="profile-description">
          Add your insurance details to get more personalized assistance
        </p>
        
        <form onSubmit={handleSubmit} className="insurance-form">
          <div className="form-group">
            <label htmlFor="provider">Insurance Provider</label>
            <input
              type="text"
              id="provider"
              value={insuranceInfo.provider}
              onChange={(e) => setInsuranceInfo({...insuranceInfo, provider: e.target.value})}
              placeholder="e.g., Blue Cross Blue Shield"
            />
          </div>

          <div className="form-group">
            <label htmlFor="policyNumber">Policy Number</label>
            <input
              type="text"
              id="policyNumber"
              value={insuranceInfo.policyNumber}
              onChange={(e) => setInsuranceInfo({...insuranceInfo, policyNumber: e.target.value})}
              placeholder="e.g., ABC123456789"
            />
          </div>

          <div className="form-group">
            <label htmlFor="planType">Plan Type</label>
            <select
              id="planType"
              value={insuranceInfo.planType}
              onChange={(e) => setInsuranceInfo({...insuranceInfo, planType: e.target.value})}
            >
              <option value="">Select a plan type</option>
              <option value="PPO">PPO</option>
              <option value="HMO">HMO</option>
              <option value="EPO">EPO</option>
              <option value="POS">POS</option>
              <option value="HDHP">HDHP</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="deductible">Annual Deductible</label>
            <input
              type="text"
              id="deductible"
              value={insuranceInfo.deductible}
              onChange={(e) => setInsuranceInfo({...insuranceInfo, deductible: e.target.value})}
              placeholder="e.g., $1,000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="copay">Typical Copay</label>
            <input
              type="text"
              id="copay"
              value={insuranceInfo.copay}
              onChange={(e) => setInsuranceInfo({...insuranceInfo, copay: e.target.value})}
              placeholder="e.g., $20"
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information</label>
            <textarea
              id="additionalInfo"
              value={insuranceInfo.additionalInfo}
              onChange={(e) => setInsuranceInfo({...insuranceInfo, additionalInfo: e.target.value})}
              placeholder="Any additional details about your coverage..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 