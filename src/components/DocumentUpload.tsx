import React, { useState } from 'react';

type DocumentType = 'bill' | 'eob' | 'insurance' | 'medical';

interface UploadedDocument {
  id: string;
  type: DocumentType;
  file: File;
  uploadDate: Date;
  metadata: {
    documentType: string;
    dateOfService?: Date;
    amount?: number;
    provider?: string;
    notes?: string;
    relatedTo?: string; // Links to manually entered data
  };
}

interface DocumentUploadProps {
  onDocumentAnalyzed?: (analysis: {
    suggestedChanges?: any;
    additionalInfo?: any;
    potentialIssues?: string[];
  }) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentAnalyzed }) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [currentUpload, setCurrentUpload] = useState<{
    type: DocumentType;
    file?: File;
    metadata: any;
  }>({
    type: 'bill',
    metadata: {}
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCurrentUpload(prev => ({
        ...prev,
        file
      }));

      // Optional: Quick analysis of the document
      setIsAnalyzing(true);
      try {
        // Here you would add document analysis logic
        // For example, OCR for bills to suggest amounts
        // or parsing EOBs for coverage details
        if (onDocumentAnalyzed) {
          onDocumentAnalyzed({
            suggestedChanges: {
              // Example suggested changes based on document
            },
            additionalInfo: {
              // Additional context found in document
            },
            potentialIssues: [
              // Any red flags or issues found
            ]
          });
        }
      } catch (error) {
        console.error('Document analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleUpload = () => {
    if (!currentUpload.file) return;

    const newDocument: UploadedDocument = {
      id: Date.now().toString(),
      type: currentUpload.type,
      file: currentUpload.file,
      uploadDate: new Date(),
      metadata: currentUpload.metadata
    };

    setDocuments(prev => [...prev, newDocument]);
    
    // Clear the form
    setCurrentUpload({
      type: 'bill',
      metadata: {}
    });
  };

  return (
    <div className="document-upload">
      <h2>Supporting Documents</h2>
      <p className="upload-description">
        Upload documents to verify information and provide additional context for analysis
      </p>
      
      <div className="upload-section">
        <div className="document-type-selector">
          <label>Document Type</label>
          <select 
            value={currentUpload.type}
            onChange={(e) => setCurrentUpload(prev => ({
              ...prev,
              type: e.target.value as DocumentType
            }))}
          >
            <option value="bill">Medical Bill</option>
            <option value="eob">Explanation of Benefits</option>
            <option value="insurance">Insurance Document</option>
            <option value="medical">Medical Record</option>
          </select>
        </div>

        <div className="file-upload">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
          />
          <p className="help-text">
            {isAnalyzing ? 'Analyzing document...' : 'Accepted formats: PDF, JPG, PNG'}
          </p>
        </div>

        <div className="metadata-form">
          <input
            type="text"
            placeholder="Document Description (optional)"
            onChange={(e) => setCurrentUpload(prev => ({
              ...prev,
              metadata: {
                ...prev.metadata,
                notes: e.target.value
              }
            }))}
          />
          <input
            type="date"
            placeholder="Document Date"
            onChange={(e) => setCurrentUpload(prev => ({
              ...prev,
              metadata: {
                ...prev.metadata,
                dateOfService: new Date(e.target.value)
              }
            }))}
          />
        </div>

        <button 
          onClick={handleUpload}
          disabled={!currentUpload.file || isAnalyzing}
          className="upload-button"
        >
          {isAnalyzing ? 'Analyzing...' : 'Upload Document'}
        </button>
      </div>

      <div className="documents-list">
        <h3>Uploaded Documents ({documents.length})</h3>
        {documents.map(doc => (
          <div key={doc.id} className="document-item">
            <div className="document-info">
              <span className="document-type">{doc.type}</span>
              <span className="document-name">{doc.file.name}</span>
              <span className="upload-date">
                {doc.uploadDate.toLocaleDateString()}
              </span>
            </div>
            <div className="document-actions">
              <button className="view-button">View</button>
              <button 
                className="remove-button"
                onClick={() => setDocuments(prev => 
                  prev.filter(d => d.id !== doc.id)
                )}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 