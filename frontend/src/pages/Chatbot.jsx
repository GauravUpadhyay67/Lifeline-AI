import axios from 'axios';
import { Activity, Bot, Loader, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ML_URL } from '../config';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your **AI Health Assistant**. I can help you understand symptoms, diseases, and general health advice. How can I help you today?' }
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
      const response = await axios.post(`${ML_URL}/chat`, {
        message: input
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const serverError = error.response?.data?.response || error.response?.data?.message || 'I am having trouble reaching the AI server.';
      const errorMessage = { 
        sender: 'bot', 
        text: `⚠️ **AI Service Error**: ${serverError}\n\nPlease try again in a few moments or check your connection.` 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      height: '85vh',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      textAlign: 'center',
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    subtitle: {
        color: '#64748b',
        fontSize: '1rem'
    },
    chatWindow: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '24px',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      padding: '2rem',
      overflowY: 'auto',
      marginBottom: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      scrollBehavior: 'smooth',
    },
    messageRow: (sender) => ({
      display: 'flex',
      justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-end',
      gap: '0.75rem',
    }),
    avatar: (sender) => ({
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: sender === 'user' ? '#0ea5e9' : '#dcfce7',
        color: sender === 'user' ? 'white' : '#16a34a',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }),
    messageBubble: (sender) => ({
      maxWidth: '75%',
      padding: '1rem 1.25rem',
      borderRadius: '18px',
      backgroundColor: sender === 'user' ? '#0ea5e9' : '#f8fafc',
      color: sender === 'user' ? 'white' : '#334155',
      borderTopRightRadius: sender === 'user' ? '4px' : '18px',
      borderTopLeftRadius: sender === 'user' ? '18px' : '4px',
      lineHeight: '1.6',
      fontSize: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      border: sender === 'user' ? 'none' : '1px solid #f1f5f9'
    }),
    inputForm: {
      display: 'flex',
      gap: '1rem',
      backgroundColor: 'white',
      padding: '0.75rem',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    },
    input: {
      flex: 1,
      padding: '0.8rem 1rem',
      borderRadius: '12px',
      border: 'none',
      fontSize: '1rem',
      outline: 'none',
      backgroundColor: 'transparent',
    },
    button: {
      padding: '0.8rem 1.5rem',
      backgroundColor: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
    }
  };

  return (
    <div className="chat-container" style={styles.container}>
      <div style={styles.header}>
        <h1 className="chat-title" style={styles.title}>
            <Activity /> Health Assistant
        </h1>
        <p style={styles.subtitle}>Powered by Lifeline Local Expert Engine • Your Secure Health Information Assistant</p>
      </div>
      
      <div className="chat-window" style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.messageRow(msg.sender)}>
             {msg.sender === 'bot' && (
                 <div style={styles.avatar('bot')}><Bot size={20} /></div>
             )}
            
            <div className="chat-bubble" style={styles.messageBubble(msg.sender)}>
              {msg.sender === 'bot' ? (
                <ReactMarkdown 
                  components={{
                    p: ({node, ...props}) => <p style={{margin: 0, marginBottom: '0.5rem'}} {...props} />,
                    ul: ({node, ...props}) => <ul style={{paddingLeft: '1.5rem', margin: '0.5rem 0'}} {...props} />,
                    li: ({node, ...props}) => <li style={{marginBottom: '0.25rem'}} {...props} />,
                    strong: ({node, ...props}) => <strong style={{fontWeight: '700', color: '#0f172a'}} {...props} />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>

            {msg.sender === 'user' && (
                 <div style={styles.avatar('user')}><User size={20} /></div>
             )}
          </div>
        ))}
        {loading && (
           <div style={styles.messageRow('bot')}>
             <div style={styles.avatar('bot')}><Bot size={20} /></div>
             <div style={styles.messageBubble('bot')}>
               <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                 <Loader className="spin" size={16} /> 
                 <span>Analyzing your question...</span>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" style={styles.inputForm} onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your health question (e.g., 'What are symptoms of flu?')"
          style={styles.input}
          disabled={loading}
        />
        <button 
            type="submit" 
            style={{...styles.button, opacity: input.trim() && !loading ? 1 : 0.6}} 
            disabled={!input.trim() || loading}
        >
          <Send size={18} /> Send
        </button>
      </form>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Chatbot;
