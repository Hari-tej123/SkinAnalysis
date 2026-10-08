import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Shield, 
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { streamChatMessage, sendChatMessage } from '../api';

const DEFAULT_QUESTIONS = [
  "What is the best daily cleanser for my skin type?",
  "Can I use Vitamin C in the morning and Retinol at night?",
  "How can I minimize my open pores effectively?",
  "Recommend a sunscreen that won't clog pores or cause breakouts."
];

export default function Chat() {
  const skinResult = JSON.parse(sessionStorage.getItem('skinResult') || 'null');
  
  const initialGreeting = skinResult
    ? `Hello! I'm Dr. Nova, your clinical AI skincare specialist. I've reviewed your biometric scan (${skinResult.prediction?.primary_condition?.replace('_', ' ')}, ${skinResult.prediction?.skin_type || 'Combination skin'}). How can I help refine your daily routine or ingredient choices today?`
    : "Hello! I'm Dr. Nova, your AI skincare assistant. You haven't scanned your skin yet, but feel free to ask any questions about routines, ingredients, or skin concerns!";

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: initialGreeting
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (userText = null) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: 'user', content: textToSend };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    const assistantIndex = nextHistory.length;

    try {
      await streamChatMessage({
        message: textToSend,
        skinContext: skinResult,
        history: messages.map(m => ({ role: m.role, content: m.content })),
        sessionId: sessionId,
        analysisId: skinResult?.analysis_id,
        onToken: (chunk, full) => {
          setMessages((prev) => {
            const copy = [...prev];
            copy[assistantIndex] = { role: 'assistant', content: full };
            return copy;
          });
        },
        onComplete: () => {
          setLoading(false);
        },
        onError: async (err) => {
          console.warn('Streaming fallback triggered:', err);
          try {
            const res = await sendChatMessage(
              textToSend,
              skinResult,
              messages.map(m => ({ role: m.role, content: m.content })),
              sessionId,
              skinResult?.analysis_id
            );
            if (res.session_id) setSessionId(res.session_id);
            setMessages((prev) => [
              ...prev.slice(0, assistantIndex),
              { role: 'assistant', content: res.response }
            ]);
          } catch (fallbackErr) {
            setMessages((prev) => [
              ...prev.slice(0, assistantIndex),
              {
                role: 'assistant',
                content: "I'm having a brief connection issue. Please make sure your API key or network connection is active and try again."
              }
            ]);
          }
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Chat error:', err);
      setLoading(false);
    }
  };

  const handleChipClick = (q) => {
    setInput(q);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6">
      
      {/* Left Sidebar: Compact Skin Profile */}
      <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-white rounded-2xl p-5 shadow-card border border-slate-100 flex flex-col justify-between overflow-y-auto hidden md:flex">
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Loaded Skin Context</span>
            </div>
            {skinResult && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Active Scan
              </span>
            )}
          </div>

          {skinResult ? (
            <div className="space-y-4">
              {/* Primary match */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Issue</span>
                <p className="font-extrabold text-slate-900 text-base capitalize">
                  {skinResult.prediction?.primary_condition?.replace('_', ' ')}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Type: <strong className="text-slate-800">{skinResult.prediction?.skin_type || 'Normal'}</strong></span>
                  <span className="font-bold text-brand-600">{skinResult.prediction?.confidence}% match</span>
                </div>
              </div>

              {/* Recommended Actives */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Key Target Actives
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skinResult.recommendations?.key_ingredients?.slice(0, 4).map((ing, i) => (
                    <span key={i} className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Routine quick check */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-amber-50/60 border border-amber-100 rounded-lg flex items-center gap-2 text-slate-700">
                  <Sun className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="truncate">{skinResult.recommendations?.morning_routine?.[1] || 'Antioxidant + SPF'}</span>
                </div>
                <div className="p-2.5 bg-sky-50/60 border border-sky-100 rounded-lg flex items-center gap-2 text-slate-700">
                  <Moon className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span className="truncate">{skinResult.recommendations?.night_routine?.[1] || 'Active Treatment + Barrier Cream'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600">
                No active scan detected. Run a quick face scan for personalized guidance.
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-white border border-brand-200 px-3 py-1.5 rounded-lg shadow-2xs"
              >
                Start Free Scan →
              </Link>
            </div>
          )}
        </div>

        {/* Doctor disclaimer */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            <span>Clinical AI Assistant</span>
          </div>
          <p>Advice is for educational purposes. Always consult a dermatologist for prescriptions.</p>
        </div>
      </aside>

      {/* Right Main Area: Chat Messages & Input */}
      <main className="flex-1 bg-white rounded-2xl shadow-card border border-slate-100 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-sm font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                Dr. Nova AI Skincare Specialist
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-500">Evidence-based personalized dermatology assistant</p>
            </div>
          </div>

          <Link
            to="/results"
            className="text-xs font-semibold text-slate-600 hover:text-brand-600 border border-slate-200 px-3 py-1.5 rounded-lg bg-white shadow-2xs transition-colors hidden sm:block"
          >
            View Full Report
          </Link>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={i}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-xl px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-brand-500 text-white font-medium rounded-tr-xs shadow-sm shadow-brand-500/20'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/70 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {msg.content}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200/70 px-4 py-3 rounded-2xl rounded-tl-xs text-slate-500 text-xs flex items-center gap-1.5">
                <span className="dot-1 w-1.5 h-1.5 rounded-full bg-brand-500" />
                <span className="dot-2 w-1.5 h-1.5 rounded-full bg-brand-500" />
                <span className="dot-3 w-1.5 h-1.5 rounded-full bg-brand-500" />
                <span className="ml-1.5 font-medium text-slate-500">Formulating response...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
            Suggested:
          </span>
          {DEFAULT_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(q)}
              className="text-[11px] bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-600 text-slate-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about active ingredients, routines, acne treatments, or SPF..."
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white p-3 rounded-xl font-semibold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

    </div>
  );
}