import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useDocStore from '../store/useDocStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Send, 
  ArrowLeft, 
  Bot, 
  User, 
  Quote, 
  FileText,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

const ChatPage = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { currentSession, sendMessage, fetchSessionHistory, loading } = useDocStore();
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // In a real app, we might load a specific session or start new
    // For this hackathon version, we'll just handle the session logic in the store
  }, [docId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query || isTyping) return;

    const currentQuery = query;
    setQuery('');
    setIsTyping(true);
    
    await sendMessage(docId, currentQuery, currentSession?._id);
    setIsTyping(false);
  };

  return (
    <div className="pt-20 h-screen flex overflow-hidden">
      {/* Sidebar / Info */}
      <div className="w-80 glass border-r border-border hidden lg:flex flex-col p-6 overflow-y-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-muted hover:text-text font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>

        <div className="mb-10">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Document Context</h3>
          <Card className="p-4 bg-accent/5 border-accent/20">
            <FileText className="text-accent h-8 w-8 mb-3" />
            <p className="font-bold text-sm truncate">{currentSession?.document?.title || 'Active Document'}</p>
            <p className="text-[10px] text-muted mt-1 uppercase tracking-tighter">Ready for Semantic Query</p>
          </Card>
        </div>

        <div>
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Latest Citations</h3>
          <div className="space-y-3">
            {currentSession?.messages?.slice(-1)[0]?.citations?.map((cite, i) => (
              <div key={i} className="p-3 bg-surface/50 border border-border rounded-xl text-[11px] leading-relaxed group hover:border-teal/30 transition-all">
                <div className="flex items-center gap-2 text-teal font-bold mb-1">
                  <Quote className="h-3 w-3" /> Source {i + 1}
                </div>
                <p className="text-muted line-clamp-3 italic">"{cite.text}"</p>
              </div>
            )) || <p className="text-xs text-muted italic">Ask a question to see citations...</p>}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 pb-32">
          {currentSession?.messages?.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'assistant' ? 'max-w-4xl' : 'max-w-2xl ml-auto flex-row-reverse'}`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg
                ${msg.role === 'assistant' ? 'bg-accent text-white' : 'bg-surface border border-border text-accent'}`}>
                {msg.role === 'assistant' ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
              </div>
              
              <div className={`space-y-4 ${msg.role === 'assistant' ? 'text-left' : 'text-right'}`}>
                <div className={`p-6 rounded-3xl leading-relaxed text-lg
                  ${msg.role === 'assistant' ? 'glass border-border/50 text-text' : 'bg-accent text-white shadow-xl shadow-accent/20'}`}>
                  {msg.content}
                </div>
                
                {msg.citations?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((_, idx) => (
                      <span key={idx} className="px-2 py-1 bg-teal/10 text-teal text-[10px] font-bold rounded-md flex items-center gap-1 border border-teal/20">
                        <Info className="h-3 w-3" /> Citation {idx + 1}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-4 max-w-2xl">
              <div className="h-10 w-10 rounded-xl bg-accent text-white flex items-center justify-center animate-pulse">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="p-6 rounded-3xl glass border-border/50 flex gap-1">
                <div className="h-2 w-2 bg-accent rounded-full animate-bounce" />
                <div className="h-2 w-2 bg-accent rounded-full animate-bounce delay-75" />
                <div className="h-2 w-2 bg-accent rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6">
          <form onSubmit={handleSend} className="glass border-accent/20 rounded-2xl p-2 flex items-center gap-2 shadow-2xl shadow-accent/10">
            <input 
              type="text"
              placeholder="Query your document..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              className="h-12 w-12 rounded-xl p-0 flex items-center justify-center"
              disabled={!query || isTyping}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted mt-3 uppercase tracking-widest font-bold">
            Powered by Gemini Pro RAG Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
