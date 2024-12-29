import React, { useState, useRef, useEffect } from 'react';
import { HfInference } from '@huggingface/inference';
import './App.css';
import { Profile } from './components/Profile';
import { BillAuditor } from './components/BillAuditor';
import { TreatmentInfo } from './components/TreatmentInfo';
import { BillItem } from './types';
import { ProfileOverview } from './components/ProfileOverview';
import { Message } from './components/Message';
import { DocumentUpload } from './components/DocumentUpload';
import './styles/DocumentUpload.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  planType: string;
  deductible: string;
  copay: string;
  additionalInfo: string;
}

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

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo | null>(null);
  const [showBillAuditor, setShowBillAuditor] = useState(false);
  const [showTreatmentInfo, setShowTreatmentInfo] = useState(false);
  const [showProfileOverview, setShowProfileOverview] = useState(false);
  const [treatmentInfo, setTreatmentInfo] = useState<TreatmentDetails>({
    description: '',
    date: '',
    provider: '',
    location: '',
    wasEmergency: false,
    symptoms: '',
    diagnosis: '',
    followupNeeded: false
  });
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);

  const inference = new HfInference(process.env.AI_API_TOKEN);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load saved insurance info on startup
  useEffect(() => {
    const savedInfo = localStorage.getItem('insuranceInfo');
    if (savedInfo) {
      try {
        setInsuranceInfo(JSON.parse(savedInfo));
      } catch (e) {
        console.error('Error loading saved insurance info:', e);
      }
    }

    // Load saved treatment info
    const savedTreatment = localStorage.getItem('treatmentInfo');
    if (savedTreatment) {
      try {
        setTreatmentInfo(JSON.parse(savedTreatment));
      } catch (e) {
        console.error('Error loading saved treatment info:', e);
      }
    }
  }, []);

  const analyzeWithAI = async (text: string) => {
    try {
      console.log('Sending request to x.ai API...');
  
      // Create a context string from insurance info if available
      const insuranceContext = insuranceInfo ? `
User's Insurance Information:
- Provider: ${insuranceInfo.provider}
- Plan Type: ${insuranceInfo.planType}
- Deductible: ${insuranceInfo.deductible}
- Copay: ${insuranceInfo.copay}
${insuranceInfo.additionalInfo ? `- Additional Info: ${insuranceInfo.additionalInfo}` : ''}

Please consider this information when responding to their query.
` : '';
  
      const requestBody = {
        messages: [
          {
            role: 'system',
            content: `You are Hatch.AI, a helpful and knowledgeable healthcare claims assistant. You help users understand their healthcare claims and insurance coverage.

IMPORTANT FORMATTING INSTRUCTIONS:
1. Always use double line breaks between sections
2. Start each major section with a bold header using **Header Format**
3. Use bullet points (•) for lists
4. Use numbers (1., 2., 3.) for sequential steps
5. Keep paragraphs short and focused
6. Use markdown formatting for emphasis when needed
7. Ensure there are clear visual breaks between sections

Example Format:

**Section One**
Main point here with a short explanation.
• Bullet point one
• Bullet point two

**Section Two**
Another main point here.
1. First step
2. Second step

${insuranceContext}`
          },
          {
            role: 'user',
            content: text
          }
        ],
        model: 'grok-2-1212',
        stream: false,
        temperature: 0.3
      };
  
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${`xai-aGAIq4ocByGc5rqsWrLqU9Nqs1Jq4LfrEQDHnlioXjQDF6McJVwUwlD7G8lFXlGSloZPdnuT1uGDu94m`}` // Replace with your actual API key or env variable
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const cleanResponse = data.choices[0].message.content
          .trim();
  
        if (!cleanResponse) {
          throw new Error('Empty response received');
        }
  
        return cleanResponse;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
  
      if (error instanceof Error) {
        return `I apologize, but I encountered an error: ${error.message}. Please try again.`;
      }
  
      return "I'm currently experiencing technical difficulties. Please try again in a moment.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // This breaks if you change it
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Might comment this out later
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000);
    });

    try {
      const aiResponse = await Promise.race([
        analyzeWithAI(newMessage),
        timeoutPromise
      ]);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: typeof aiResponse === 'string' ? aiResponse : 'Sorry, I encountered an error.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I took too long to respond. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setNewMessage('');
    setIsTyping(false);
  };

  const generateAnalysis = async () => {
    if (!insuranceInfo) {
      alert("Please enter your insurance information first");
      return;
    }

    setIsTyping(true);

    const analysisPrompt = `
Please analyze this healthcare situation and format your response in clear, separate sections with headers in bold (**Header**) and use line breaks between sections.

Information to analyze:

INSURANCE INFORMATION:
- Provider: ${insuranceInfo.provider}
- Plan Type: ${insuranceInfo.planType}
- Deductible: ${insuranceInfo.deductible}
- Copay: ${insuranceInfo.copay}
- Policy Details: ${insuranceInfo.additionalInfo}

MEDICAL BILLS:
${billItems.map(item => `- ${item.description}: $${item.amount} (Code: ${item.code})`).join('\n')}

TREATMENT DETAILS:
${treatmentInfo.description}

Please provide a comprehensive analysis with the following sections:

**Insurance Coverage Overview**
[Explain their current insurance plan and key features]

**Bill Analysis**
[Break down the medical bills and identify any concerns]

**Coverage Assessment**
[Explain what should be covered under their plan]

**Potential Issues**
[List any overcharges, coding errors, or coverage concerns]

**Patient Rights & Protections**
[Explain relevant healthcare laws and patient protections]

**Recommended Actions**
[List specific steps they should take, numbered for clarity]

**Cost Saving Opportunities**
[Identify ways to reduce costs]

**Next Steps Summary**
[Prioritized list of actions to take]

Please ensure each section is clearly separated with line breaks and use bullet points or numbered lists where appropriate.`;

    try {
      const response = await analyzeWithAI(analysisPrompt);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-container">
          <div className="logo" onClick={handleResetChat} role="button" tabIndex={0}>
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 2L2 7L12 12L22 7L12 2Z" 
                className="logo-primary"
              />
              <path 
                d="M2 17L12 22L22 17" 
                className="logo-secondary"
                strokeLinecap="round"
              />
              <path 
                d="M2 12L12 17L22 12" 
                className="logo-accent"
                strokeLinecap="round"
              />
            </svg>
            <h1>Hatch.AI</h1>
          </div>
        </div>
      </header>
      
      <main className="chat-container">
        <div className="messages-container">
          {messages.length === 0 && (
            <>
              <div className="welcome-message">
                <div className="welcome-icon">🐣</div>
                <h2>Welcome to Hatch.AI</h2>
                <p className="tagline">Simplifying healthcare claims with AI intelligence</p>
                <p className="description">Your personal AI assistant that helps decode insurance policies, explain coverage, and guide you through the claims process.</p>
                
                <div className="feature-grid">
                  <div 
                    className="feature clickable"
                    onClick={() => setShowProfile(true)}
                  >
                    <span className="feature-icon">👤</span>
                    <h3>Insurance Details</h3>
                    <p>Enter your insurance plan information</p>
                  </div>
                  
                  <div 
                    className="feature clickable"
                    onClick={() => setShowBillAuditor(true)}
                  >
                    <span className="feature-icon">🔍</span>
                    <h3>Medical Bills</h3>
                    <p>Add your medical charges</p>
                  </div>
                  
                  <div 
                    className="feature clickable"
                    onClick={() => setShowTreatmentInfo(true)}
                  >
                    <span className="feature-icon">🏥</span>
                    <h3>Treatment Details</h3>
                    <p>Describe your medical services</p>
                  </div>

                  <div 
                    className="feature clickable"
                    onClick={() => setShowProfileOverview(true)}
                  >
                    <span className="feature-icon">📋</span>
                    <h3>Review Profile</h3>
                    <p>View and edit your information</p>
                  </div>

                  <div 
                    className="feature clickable"
                    onClick={() => setShowDocumentUpload(true)}
                  >
                    <span className="feature-icon">📄</span>
                    <h3>Upload Documents</h3>
                    <p>Add medical bills, EOBs, and records</p>
                  </div>
                </div>

                <div className="welcome-examples">
                  <h3>Try asking about:</h3>
                  <div className="example-chips">
                    <button onClick={() => setNewMessage("What's my copay for a specialist visit with my current insurance?")}>
                      Specialist copay
                    </button>
                    <button onClick={() => setNewMessage("How much of my deductible have I met this year?")}>
                      Deductible status
                    </button>
                    <button onClick={() => setNewMessage("Is my prescription covered under my plan?")}>
                      Prescription coverage
                    </button>
                    <button onClick={() => setNewMessage("How do I find an in-network provider?")}>
                      Find providers
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="trust-banner">
                <p>Trusted by thousands of users for their healthcare insurance needs</p>
                <div className="trust-metrics">
                  <div className="metric">
                    <span className="metric-number">50K+</span>
                    <span className="metric-label">Questions Answered</span>
                  </div>
                  <div className="metric">
                    <span className="metric-number">98%</span>
                    <span className="metric-label">Accuracy Rate</span>
                  </div>
                  <div className="metric">
                    <span className="metric-number">24/7</span>
                    <span className="metric-label">Availability</span>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {messages.map((message) => (
            <Message 
              key={message.id}
              text={message.text}
              sender={message.sender}
            />
          ))}
          
          {isTyping && (
            <div className="message ai-message">
              <div className="message-content">
                <span className="message-icon">🐣</span>
                <p className="typing-indicator">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="message-form">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="message-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isTyping}
          />
          <button type="submit" className="send-button" disabled={isTyping}>
            {isTyping ? '...' : 'Generate Review'} 
          </button>
        </form>
      </main>
      {showProfile && (
        <Profile
          onClose={() => setShowProfile(false)}
          onSave={(info) => {
            setInsuranceInfo(info);
            localStorage.setItem('insuranceInfo', JSON.stringify(info));
          }}
          savedInfo={insuranceInfo || undefined}
        />
      )}

      {showBillAuditor && (
        <div className="profile-overlay">
          <div className="profile-modal">
            <button className="close-button" onClick={() => setShowBillAuditor(false)}>×</button>
            <BillAuditor 
              onSave={(items) => setBillItems(items)}
              initialBills={billItems}
              onClose={() => setShowBillAuditor(false)}
            />
          </div>
        </div>
      )}

      {showTreatmentInfo && (
        <TreatmentInfo
          onClose={() => setShowTreatmentInfo(false)}
          onSave={(info) => {
            setTreatmentInfo(info);
            localStorage.setItem('treatmentInfo', JSON.stringify(info));
          }}
          savedInfo={treatmentInfo}
        />
      )}

      {showProfileOverview && (
        <ProfileOverview
          insuranceInfo={insuranceInfo}
          treatmentInfo={treatmentInfo}
          billItems={billItems}
          onEditInsurance={() => {
            setShowProfile(true);
            setShowProfileOverview(false);
          }}
          onEditTreatment={() => {
            setShowTreatmentInfo(true);
            setShowProfileOverview(false);
          }}
          onEditBills={() => {
            setShowBillAuditor(true);
            setShowProfileOverview(false);
          }}
          onClose={() => setShowProfileOverview(false)}
        />
      )}

      {showDocumentUpload && (
        <div className="profile-overlay">
          <div className="profile-modal">
            <button className="close-button" onClick={() => setShowDocumentUpload(false)}>×</button>
            <DocumentUpload />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
