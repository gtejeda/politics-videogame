'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IdeologyPicker } from './IdeologyPicker';
import { QRShare } from './QRShare';
import type { RoomStatePayload } from '@/lib/game/events';
import type { Ideology } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

interface LobbyProps {
  roomId: string;
  roomState: RoomStatePayload;
  localPlayerId: string | null;
  isHost: boolean;
  onSelectIdeology: (ideology: Ideology) => void;
  onStartGame: () => void;
}

export function Lobby({
  roomId,
  roomState,
  localPlayerId,
  isHost,
  onSelectIdeology,
  onStartGame,
}: LobbyProps) {
  const players = roomState.players;
  const localPlayer = players.find(p => p.id === localPlayerId);
  const playerCount = players.length;
  const minPlayers = roomState.settings.minPlayers;
  const maxPlayers = roomState.settings.maxPlayers;

  // Get taken ideologies
  const takenIdeologies = new Set(
    players
      .filter(p => p.id !== localPlayerId && p.ideology)
      .map(p => p.ideology!)
  );

  // Can start game?
  const allHaveIdeology = players.every(p => p.ideology !== null);
  const hasEnoughPlayers = playerCount >= minPlayers;
  const canStart = isHost && allHaveIdeology && hasEnoughPlayers;

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Room Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Waiting for Players</h1>
          <p className="text-muted-foreground">
            {playerCount} / {maxPlayers} players
          </p>
        </div>

        {/* Share Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">Room Code</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="text-4xl font-mono font-bold tracking-widest">
              {roomId}
            </div>
            <QRShare roomId={roomId} />
            <p className="text-sm text-muted-foreground">
              Share this code with other players to join
            </p>
          </CardContent>
        </Card>

        {/* Ideology Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Your Ideology</CardTitle>
          </CardHeader>
          <CardContent>
            <IdeologyPicker
              selectedIdeology={localPlayer?.ideology || null}
              takenIdeologies={takenIdeologies}
              onSelect={onSelectIdeology}
            />
          </CardContent>
        </Card>

        {/* Player List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Players</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{player.name}</span>
                    {player.isHost && (
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        Host
                      </span>
                    )}
                    {player.id === localPlayerId && (
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs">
                        You
                      </span>
                    )}
                  </div>
                  {player.ideology ? (
                    <span
                      className="rounded-full px-3 py-1 text-sm text-white"
                      style={{ backgroundColor: IDEOLOGY_DEFINITIONS[player.ideology].color }}
                    >
                      {IDEOLOGY_DEFINITIONS[player.ideology].name}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Choosing...
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Start Game Button (Host Only) */}
        {isHost && (
          <div className="space-y-2">
            <Button
              className="w-full"
              size="lg"
              onClick={onStartGame}
              disabled={!canStart}
            >
              Start Game
            </Button>
            {!hasEnoughPlayers && (
              <p className="text-center text-sm text-muted-foreground">
                Need at least {minPlayers} players to start
              </p>
            )}
            {hasEnoughPlayers && !allHaveIdeology && (
              <p className="text-center text-sm text-muted-foreground">
                Waiting for all players to choose an ideology
              </p>
            )}
          </div>
        )}

        {!isHost && (
          <p className="text-center text-sm text-muted-foreground">
            Waiting for host to start the game...
          </p>
        )}
      </div>
    </div>
  );
}
