import React, { useState, useRef, useEffect } from 'react';
import { PCBBoard, PCBComponent, ChatMessage } from '../types';
import { aiApi } from '../services/aiApi';
import { 
  Sparkles, 
  Send, 
  Cpu, 
  HelpCircle, 
  FileText, 
  RefreshCw, 
  AlertTriangle, 
  Bot, 
  User, 
  Terminal,
  Zap
} from 'lucide-react';

interface AIChatProps {
  board: PCBBoard;
  selectedComponent?: PCBComponent;
  onOpenDatasheet?: (datasheetId?: string) => void;
  onNavigateToFaults?: () => void;
  className?: string;
}

export const AIChat: React.FC<AIChatProps> = ({
  board,
  selectedComponent,
  onOpenDatasheet,
  onNavigateToFaults,
  className = ''
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      content: `Hello! I am your PCB-aware circuit engineering assistant. 

I have indexed **${board.name}** (${board.components.length} components detected). 

Ask me about schematic traces, component functionalities, troubleshooting flagged anomalies, or find replacement parts.`,
      timestamp: 'Just now',
      suggestedPrompts: [
        'Explain this circuit',
        'What could be wrong?',
        'What does U1 do?',
        'Show U1 datasheet',
        'Find replacement'
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiApi.generateResponse(query, board, selectedComponent);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedComponentId: response.relatedComponentId,
        relatedDatasheetId: response.relatedDatasheetId,
        suggestedPrompts: response.suggestedPrompts
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg = err?.message || 'Unable to analyze query';
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          content: `⚠️ **AI Assistant Error**: ${errorMsg}\n\n*Failed to generate dynamic response using Gemini 2.5 Flash. Please verify that the \`GEMINI_API_KEY\` environment variable is configured on the server.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActionPrompts = [
    'Explain this circuit',
    'What could be wrong?',
    'What does U1 do?',
    'Show U1 datasheet',
    'Find replacement'
  ];

  return (
    <div className={`flex flex-col bg-[#12151A] border border-slate-800 rounded-xl overflow-hidden shadow-2xl ${className}`}>
      {/* Header with PCB Context badge */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0A0C0E] border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#00D1FF15] text-[#00D1FF] border border-[#00D1FF30]">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <span>PCB-aware AI Assistant</span>
            </h3>
            {/* Exactly as requested: Show "PCB Context: Main Board #01" */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="font-mono text-[11px] text-[#00D1FF]">
                PCB Context: {board.name}
              </span>
              {selectedComponent && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1A1E25] text-slate-300 font-mono border border-slate-700">
                  Focus: {selectedComponent.id} ({selectedComponent.name})
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `reset-${Date.now()}`,
                sender: 'assistant',
                content: `Chat reset. Context reloaded for **${board.name}**.`,
                timestamp: 'Just now',
                suggestedPrompts: quickActionPrompts
              }
            ]);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1A1E25] transition-colors"
          title="Reset conversation"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1 px-1">
              {msg.sender === 'user' ? (
                <>
                  <span>Hardware Engineer</span>
                  <User size={11} />
                </>
              ) : (
                <>
                  <Bot size={11} className="text-[#00D1FF]" />
                  <span className="text-[#00D1FF] font-medium">CircuSense Intelligence</span>
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[88%] rounded-xl p-3.5 leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-[#00D1FF] text-[#0A0C0E] font-medium rounded-tr-none'
                  : 'bg-[#0A0C0E] border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs">
                {msg.content}
              </div>

              {/* Action shortcuts if assistant provided related component or datasheet */}
              {(msg.relatedDatasheetId || msg.relatedComponentId) && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 mt-2">
                  {msg.relatedDatasheetId && onOpenDatasheet && (
                    <button
                      onClick={() => onOpenDatasheet(msg.relatedDatasheetId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1A1E25] hover:bg-slate-800 text-[#00D1FF] font-mono text-[11px] border border-slate-700 transition-colors"
                    >
                      <FileText size={12} />
                      <span>Open Datasheet</span>
                    </button>
                  )}
                  {msg.relatedComponentId && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Component Ref: {msg.relatedComponentId}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick response pills under assistant messages */}
            {msg.suggestedPrompts && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[88%]">
                {msg.suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1E25] hover:bg-[#00D1FF15] hover:text-[#00D1FF] hover:border-[#00D1FF50] text-slate-400 border border-slate-700 transition-all font-mono"
                  >
                    + {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-[#0A0C0E] border border-slate-800 rounded-xl rounded-tl-none w-fit text-slate-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse delay-100" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse delay-200" />
            <span className="font-mono text-[11px] text-[#00D1FF] ml-1">Analyzing circuit graph & parameters...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Toolbar Chips */}
      <div className="px-4 py-2 bg-[#0A0C0E] border-t border-slate-800/80 overflow-x-auto flex items-center gap-1.5">
        <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider shrink-0 mr-1">
          Quick Actions:
        </span>
        {quickActionPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-md bg-[#1A1E25] hover:bg-slate-800 text-slate-300 hover:text-[#00D1FF] text-[11px] border border-slate-700/80 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-3 bg-[#0A0C0E] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about this PCB (e.g. 'What does U1 do?', 'Find replacement')..."
            className="flex-1 px-3.5 py-2 rounded-lg bg-[#12151A] border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00D1FF] font-sans"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-3.5 py-2 rounded-lg bg-[#00D1FF] hover:bg-[#00B8E0] disabled:opacity-40 disabled:hover:bg-[#00D1FF] text-[#0A0C0E] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
          >
            <Send size={13} />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
