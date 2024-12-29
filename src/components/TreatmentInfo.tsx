import React, { useState } from 'react';

interface TreatmentDetails {
  description: string;
  date: string;
  provider: string;
  location: string;
  wasEmergency: boolean;
  symptoms: string;
  diagnosis: string;
  followupNeeded: boolean;
}

export const TreatmentInfo: React.FC<{
  onClose: () => void;
  onSave: (info: TreatmentDetails) => void;
  savedInfo?: TreatmentDetails;
}> = ({ onClose, onSave, savedInfo }) => {
  const [info, setInfo] = useState<TreatmentDetails>(savedInfo || {
    description: '',
    date: '',
    provider: '',
    location: '',
    wasEmergency: false,
    symptoms: '',
    diagnosis: '',
    followupNeeded: false
  });

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Treatment Details</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(info);
          onClose();
        }}>
          <div className="form-group">
            <label>What happened? (Description of Treatment)</label>
            <textarea
              value={info.description}
              onChange={(e) => setInfo({...info, description: e.target.value})}
              placeholder="Describe what medical services you received..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Date of Service</label>
            <input
              type="date"
              value={info.date}
              onChange={(e) => setInfo({...info, date: e.target.value})}
            />
          </div>

          {/* Add more fields as needed */}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 