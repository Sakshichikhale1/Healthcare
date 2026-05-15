import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Bot, Sparkles, User, Minimize2, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AskAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hello! I'm ClinicOS AI. How can I help you today? I can summarize reports, explain billing, or assist with clinical queries." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      // Simulate AI response for now (real integration would use backend)
      // In a real app, we'd call an API that streams the response
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: getSimulatedResponse(userMessage) 
        }]);
      }, 1500);
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
  };

  const getSimulatedResponse = (query: string) => {
    query = query.toLowerCase();
    if (query.includes("report") || query.includes("summarize")) {
      return "I've analyzed the latest MRI for Liam O'Brien. It shows a mild L4-L5 disc bulge without nerve root compression. Triage recommendation: Routine physical therapy.";
    }
    if (query.includes("billing") || query.includes("invoice")) {
      return "The last invoice for consultation #4893 is $250.00. Insurance (BlueCross PPO) has covered 80%. Patient responsibility: $50.00.";
    }
    if (query.includes("hi") || query.includes("hello")) {
      return "Hello! How can I assist you with your clinical tasks today?";
    }
    return "That's a good question. Based on current clinical guidelines, I recommend reviewing the patient's history of hypertension before prescribing NSAIDs for back pain.";
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover:scale-110 transition-transform z-50"
      >
        <MessageSquare className="h-6 w-6 text-primary-foreground" />
      </Button>
    );
  }

  return (
    <Card className={`fixed right-6 bottom-6 w-80 sm:w-96 flex flex-col z-50 transition-all duration-300 shadow-elegant overflow-hidden ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
      {/* Header */}
      <div className="bg-gradient-primary p-3 flex items-center justify-between text-primary-foreground shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-semibold text-sm">Ask ClinicOS AI</span>
          <Badge variant="outline" className="text-[10px] bg-white/20 text-white border-none py-0 h-4">Beta</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-white/20" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-white/20" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Area */}
          <div className="flex-1 overflow-hidden flex flex-col bg-secondary/10">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${m.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                        {m.role === 'assistant' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                      </div>
                      <div className={`rounded-2xl px-3 py-2 text-sm ${m.role === 'assistant' ? 'bg-white border border-border text-foreground shadow-sm' : 'bg-primary text-primary-foreground'}`}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[85%]">
                      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="rounded-2xl px-3 py-2 bg-white border border-border shadow-sm flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-border bg-white shrink-0">
            <div className="flex gap-2">
              <Input 
                placeholder="Ask about reports, billing..." 
                className="text-xs h-9"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <Button size="icon" className="h-9 w-9 bg-gradient-primary shrink-0" onClick={handleSend} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Sparkles className="h-2.5 w-2.5" /> AI can make mistakes. Verify clinical info.
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
