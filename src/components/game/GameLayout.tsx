'use client';

import { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUIStore, type GameTab } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils';
import { HelpIcon } from './HelpIcon';
import { HelpOverlay } from './HelpOverlay';
import type { GamePhase } from '@/lib/game/types';

interface GameLayoutProps {
  children?: ReactNode;
  playersBar: ReactNode;
  actionContent: ReactNode;
  dealsContent: ReactNode;
  historyContent: ReactNode;
  currentPhase?: GamePhase;
  className?: string;
}

/**
 * GameLayout - Main tabbed container for the game UI
 *
 * Structure:
 * - PlayersBar (always visible) with nation status
 * - Tabs: Action | Deals | History
 *
 * Uses Radix UI Tabs via shadcn/ui components
 */
export function GameLayout({
  playersBar,
  actionContent,
  dealsContent,
  historyContent,
  currentPhase,
  className,
}: GameLayoutProps) {
  const { activeTab, setActiveTab, helpOpen, setHelpOpen } = useUIStore();

  const handleTabChange = (value: string) => {
    setActiveTab(value as GameTab);
  };

  return (
    <div className={cn('flex h-screen flex-col overflow-hidden', className)}>
      {/* Players Bar - Always visible */}
      <div className="flex-shrink-0 border-b bg-background">
        {playersBar}
      </div>

      {/* Tabbed Content Area */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* Tab Navigation */}
        <div className="flex-shrink-0 border-b bg-muted/30 px-4">
          <TabsList className="h-12 w-full justify-start gap-2 bg-transparent p-0">
            <TabsTrigger
              value="action"
              className={cn(
                'relative h-10 rounded-none border-b-2 border-transparent px-4 font-medium transition-all',
                'data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground',
                'data-[state=inactive]:text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="mr-2">🎯</span>
              Action
            </TabsTrigger>
            <TabsTrigger
              value="deals"
              className={cn(
                'relative h-10 rounded-none border-b-2 border-transparent px-4 font-medium transition-all',
                'data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground',
                'data-[state=inactive]:text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="mr-2">🤝</span>
              Deals
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className={cn(
                'relative h-10 rounded-none border-b-2 border-transparent px-4 font-medium transition-all',
                'data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground',
                'data-[state=inactive]:text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="mr-2">📜</span>
              History
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent
            value="action"
            className="m-0 h-full overflow-auto p-4 data-[state=inactive]:hidden"
            forceMount
          >
            {actionContent}
          </TabsContent>
          <TabsContent
            value="deals"
            className="m-0 h-full overflow-auto p-4 data-[state=inactive]:hidden"
            forceMount
          >
            {dealsContent}
          </TabsContent>
          <TabsContent
            value="history"
            className="m-0 h-full overflow-auto p-4 data-[state=inactive]:hidden"
            forceMount
          >
            {historyContent}
          </TabsContent>
        </div>
      </Tabs>

      {/* Help System - Persistent across all tabs */}
      <HelpIcon onClick={() => setHelpOpen(true)} />
      <HelpOverlay
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        currentPhase={currentPhase}
      />
    </div>
  );
}
