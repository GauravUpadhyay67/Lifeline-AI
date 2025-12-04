import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Health Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        message: input
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, I am having trouble connecting to the server.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto',
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      textAlign: 'center',
      marginBottom: '1rem',
      color: '#1f2937',
    },
    chatWindow: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      overflowY: 'auto',
      marginBottom: '1rem',
      border: '1px solid #e5e7eb',
    },
    messageRow: (sender) => ({
      display: 'flex',
      justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
      marginBottom: '0.5rem',
    }),
    messageBubble: (sender) => ({
      maxWidth: '70%',
      padding: '0.75rem',
      borderRadius: '12px',
      backgroundColor: sender === 'user' ? '#0ea5e9' : '#f3f4f6',
      color: sender === 'user' ? 'white' : '#1f2937',
      borderTopRightRadius: sender === 'user' ? '0' : '12px',
      borderTopLeftRadius: sender === 'user' ? '12px' : '0',
      lineHeight: '1.5',
      fontSize: '0.95rem',
    }),
    inputForm: {
      display: 'flex',
      gap: '0.5rem',
    },
    input: {
      flex: 1,
      padding: '0.75rem',
      borderRadius: '4px',
      border: '1px solid #d1d5db',
      fontSize: '1rem',
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#0ea5e9',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Health Assistant</h1>
      
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.messageRow(msg.sender)}>
            <div style={styles.messageBubble(msg.sender)}>
              {msg.sender === 'bot' ? (
                <ReactMarkdown 
                  components={{
                    p: ({node, ...props}) => <p style={{margin: 0}} {...props} />,
                    ul: ({node, ...props}) => <ul style={{paddingLeft: '1.5rem', margin: '0.5rem 0'}} {...props} />,
                    li: ({node, ...props}) => <li style={{marginBottom: '0.25rem'}} {...props} />,
                    strong: ({node, ...props}) => <strong style={{fontWeight: '600'}} {...props} />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && (
           <div style={styles.messageRow('bot')}>
            <div style={styles.messageBubble('bot')}>
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form style={styles.inputForm} onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your health question..."
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
