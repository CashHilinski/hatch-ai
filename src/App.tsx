import React, { useState, useRef, useEffect } from 'react';
import { HfInference } from '@huggingface/inference';
import './App.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const inference = new HfInference(process.env.AI_API_TOKEN);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeWithAI = async (text: string) => {
    try {
      console.log('Sending request to x.ai API...');
  
      const requestBody = {
        messages: [
          {
            role: 'system',
            content: 'You are Hatch.AI, a helpful and knowledgeable healthcare claims assistant. You help users understand their healthcare claims and insurance coverage. Keep your responses clear, accurate, and focused on healthcare claims-related topics. Do not make up or promise any benefits or services.'
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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-container">
          <div className="logo">
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
                  <div className="feature">
                    <span className="feature-icon">🎯</span>
                    <h3>Instant Answers</h3>
                    <p>Get immediate responses to your healthcare coverage questions</p>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📝</span>
                    <h3>Claims Guidance</h3>
                    <p>Step-by-step assistance with filing and tracking claims</p>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">💡</span>
                    <h3>Policy Clarity</h3>
                    <p>Complex insurance terms explained in simple language</p>
                  </div>
                </div>

                <div className="welcome-examples">
                  <h3>Try asking about:</h3>
                  <div className="example-chips">
                    <button onClick={() => setNewMessage("What's covered under my insurance plan?")}>
                      Coverage details
                    </button>
                    <button onClick={() => setNewMessage("How do I submit a claim?")}>
                      Claims process
                    </button>
                    <button onClick={() => setNewMessage("Explain my deductible")}>
                      Deductibles
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
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">
                <span className="message-icon">
                  {message.sender === 'user' ? '👤' : '🐣'}
                </span>
                <p>{message.text}</p>
              </div>
            </div>
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
            {isTyping ? '...' : 'Send'} 
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
