import React from 'react';

interface MessageProps {
  text: string;
  sender: 'user' | 'ai';
}

export const Message: React.FC<MessageProps> = ({ text, sender }) => {
  const formatText = (text: string) => {
    // Format bold text (**text**)
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Format bullet points
    formattedText = formattedText.replace(/^• (.*?)$/gm, '<li>$1</li>');
    
    // Group bullet points
    const bulletListRegex = /(?:^<li>.*<\/li>\n?)+/gm;
    formattedText = formattedText.replace(bulletListRegex, match => `<ul>${match}</ul>`);
    
    // Format numbered lists - preserve the actual numbers
    formattedText = formattedText.replace(/^(\d+)\. (.*?)$/gm, '<li value="$1">$2</li>');
    
    // Group numbered lists
    const numberedListRegex = /(?:^<li value="\d+">.*<\/li>\n?)+/gm;
    formattedText = formattedText.replace(numberedListRegex, match => `<ol>${match}</ol>`);
    
    // Add line breaks for paragraphs
    formattedText = formattedText.replace(/\n\n/g, '</p><p>');
    
    // Wrap everything in paragraphs
    formattedText = `<p>${formattedText}</p>`;
    
    // Clean up empty paragraphs
    formattedText = formattedText.replace(/<p>\s*<\/p>/g, '');
    
    return formattedText;
  };

  return (
    <div className={`message ${sender === 'user' ? 'user-message' : 'ai-message'}`}>
      <div className="message-content">
        <span className="message-icon">
          {sender === 'user' ? '👤' : '🐣'}
        </span>
        <div 
          className="message-text"
          dangerouslySetInnerHTML={{ __html: formatText(text) }}
        />
      </div>
    </div>
  );
}; 