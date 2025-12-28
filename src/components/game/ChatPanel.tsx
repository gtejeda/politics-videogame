'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PlayerStatePayload } from '@/lib/game/events';

interface ChatMessage {
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  localPlayerId: string | undefined;
  players: PlayerStatePayload[];
  onSendMessage: (text: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ChatPanel({
  messages,
  localPlayerId,
  players,
  onSendMessage,
  isCollapsed = false,
  onToggleCollapse,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onSendMessage(trimmed);
      setInputValue('');
    }
  };

  const getPlayerColor = (playerId: string): string => {
    const player = players.find(p => p.id === playerId);
    if (!player?.ideology) return 'text-muted-foreground';

    switch (player.ideology) {
      case 'progressive': return 'text-violet-600 dark:text-violet-400';
      case 'conservative': return 'text-blue-600 dark:text-blue-400';
      case 'liberal': return 'text-emerald-600 dark:text-emerald-400';
      case 'nationalist': return 'text-amber-600 dark:text-amber-400';
      case 'populist': return 'text-rose-600 dark:text-rose-400';
      default: return 'text-muted-foreground';
    }
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isCollapsed) {
    return (
      <Card className="cursor-pointer" onClick={onToggleCollapse}>
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-base">💬</span>
              Chat
            </span>
            {messages.length > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {messages.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-64">
      <CardHeader className="py-2 px-3 cursor-pointer" onClick={onToggleCollapse}>
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="text-base">💬</span>
          Negotiation
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-2 pt-0 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-1 mb-2">
          {messages.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No messages yet. Start negotiating!
            </p>
          ) : (
            messages.map((msg, idx) => {
              const isLocal = msg.playerId === localPlayerId;
              return (
                <div
                  key={`${msg.timestamp}-${idx}`}
                  className={cn(
                    'text-xs p-1.5 rounded',
                    isLocal ? 'bg-primary/10' : 'bg-muted'
                  )}
                >
                  <div className="flex items-center gap-1">
                    <span className={cn('font-medium', getPlayerColor(msg.playerId))}>
                      {msg.playerName}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="mt-0.5">{msg.text}</p>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-xs px-2 py-1 rounded border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            maxLength={200}
          />
          <Button type="submit" size="sm" className="text-xs px-2 py-1 h-auto">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
