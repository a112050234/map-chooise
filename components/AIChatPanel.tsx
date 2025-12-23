
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2, Sparkles, MapPin, Globe } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';
import { AIChatMessage } from '../types';

const AIChatPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>([
    { 
      role: 'model', 
      content: '你好！我是你的台北旅遊 AI 助手。想知道哪裡好玩、好吃的，或是交通資訊都可以問我喔！', 
      timestamp: Date.now() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number, lng: number } | undefined>();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, (err) => console.warn("Location permission denied", err));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await chatWithAssistant(input, history, location);
      
      const botMessage: AIChatMessage = {
        role: 'model',
        content: response.text,
        timestamp: Date.now(),
        groundingUrls: response.urls
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        content: '抱歉，我現在遇到了一點連線問題，請稍後再試。',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 transition-all z-40 group animate-bounce"
      >
        <div className="flex items-center gap-2">
          <Bot size={28} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">
            詢問 AI 專家
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed z-50 right-6 bottom-6 flex flex-col transition-all duration-300 shadow-2xl rounded-3xl overflow-hidden bg-white border border-emerald-100 ${
      isMinimized ? 'h-16 w-64' : 'h-[600px] w-[350px] md:w-[450px]'
    }`}>
      {/* Header */}
      <div className="bg-emerald-700 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm">台北旅遊 AI 專家</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-emerald-100 uppercase font-medium">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-emerald-50'
                }`}>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                  
                  {/* Grounding URLs */}
                  {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">參考資料來源</p>
                      {msg.groundingUrls.map((url, uidx) => (
                        <a 
                          key={uidx} 
                          href={url.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-emerald-700 transition-colors"
                        >
                          {url.uri.includes('maps') ? <MapPin size={12} /> : <Globe size={12} />}
                          <span className="text-xs truncate font-medium">{url.title || url.uri}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <div className={`text-[10px] mt-1 opacity-60 text-right ${msg.role === 'user' ? 'text-white' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-emerald-50 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-emerald-100">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="輸入您的問題..."
                className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 disabled:bg-gray-300 transition-colors shadow-md"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
              <Sparkles size={10} /> Powered by Gemini & Taipei Tourism Data
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AIChatPanel;
