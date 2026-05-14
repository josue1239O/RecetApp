import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, ChevronLeft, Sparkles, ChefHat, Key } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIPanel = ({ recipe, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: `¡Hola! Soy tu asistente culinario. ¿Qué te gustaría mejorar de tu receta de ${recipe?.title || 'hoy'}?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyBaIsz-iNdnYUOmAhkixFFS22CzDFmh9aY');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    // Si no hay API key, avisar
    if (!apiKey) {
        setShowKeyInput(true);
        return;
    }

    const userMsg = { role: 'user', text: query };
    setMessages([...messages, userMsg]);
    setQuery('');
    setIsTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Usamos el identificador más robusto del modelo
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const prompt = `Actúa como un Chef profesional de alta cocina y profesor de gastronomía. 
        Responde a la siguiente pregunta del estudiante sobre la receta "${recipe?.title}". 
        Contexto de la receta: Ingredientes [${recipe?.ingredients?.map(i => i.name).join(', ')}]. 
        Pregunta: ${query}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'ai', text: text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: `Error de conexión: ${error.message || "Verifica tu API Key o conexión."}` }]);
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const saveKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setShowKeyInput(false);
  };

  return (
    <motion.div
      className="ai-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="ai-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="ai-chat-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={onClose} style={{ color: 'white' }}><ChevronLeft /></button>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Chef IA</h3>
                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Tu asistente culinario experto</p>
              </div>
            </div>
            <button onClick={() => setShowKeyInput(true)} style={{ color: 'white', opacity: 0.7 }}><Key size={20} /></button>
          </div>
        </div>

        {showKeyInput && (
          <div style={{ padding: '1rem', background: 'var(--surface-high)', margin: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Configuración de IA</p>
            <input 
              type="password" 
              placeholder="Pega aquí tu Gemini API Key..." 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--surface-highest)' }}
            />
            <button onClick={saveKey} style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}>Guardar & Conectar</button>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: 'blue', textAlign: 'center' }}>¿Dónde saco mi API Key gratis?</a>
          </div>
        )}

        <div className="ai-messages">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              className={`message ${m.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {m.text}
            </motion.div>
          ))}
          {isTyping && (
            <div className="message ai">El chef está pensando...</div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-footer">
          <input
            className="chat-input"
            placeholder="Pregunta sobre ingredientes, porciones..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button className="btn-send" onClick={handleSend}>
            <Send size={20} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIPanel;
