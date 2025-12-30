'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocalPlayer } from '@/lib/hooks/useLocalPlayer';
import { useGameState, getLocalPlayer, isLocalPlayerHost } from '@/lib/hooks/useGameState';
import { Lobby } from '@/components/game/Lobby';
import { Board } from '@/components/game/Board';
import { Results } from '@/components/game/Results';
import { LoadingState } from '@/components/ui/spinner';
import { useGameToasts } from '@/lib/hooks/useGameToasts';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const { state: localPlayer, isLoaded: playerLoaded, setLastRoomId } = useLocalPlayer();
  const [gameState, gameActions] = useGameState(roomId);

  // Show toast notifications for game events
  useGameToasts(gameState);

  // Join room when connected
  useEffect(() => {
    if (!playerLoaded || !localPlayer) return;
    if (!gameState.connected) return;
    if (gameState.localPlayerId) return; // Already joined

    const displayName = localPlayer.displayName || 'Player';
    gameActions.joinRoom(localPlayer.playerId, displayName);
    setLastRoomId(roomId);
  }, [playerLoaded, localPlayer, gameState.connected, gameState.localPlayerId, roomId, gameActions, setLastRoomId]);

  // Loading state
  if (!playerLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState message="Loading player data..." />
      </div>
    );
  }

  // Connecting state
  if (!gameState.connected) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState
          message="Connecting to room..."
          submessage={`Room: ${roomId}`}
        />
      </div>
    );
  }

  // Waiting for room state
  if (!gameState.roomState) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState
          message="Joining room..."
          submessage={`Room: ${roomId}`}
        />
      </div>
    );
  }

  // Error state
  if (gameState.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{gameState.error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-sm text-muted-foreground underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const currentPlayer = getLocalPlayer(gameState);
  const isHost = isLocalPlayerHost(gameState);

  // Route based on game status
  switch (gameState.roomState.status) {
    case 'lobby':
      return (
        <Lobby
          roomId={roomId}
          roomState={gameState.roomState}
          localPlayerId={gameState.localPlayerId}
          isHost={isHost}
          onSelectIdeology={gameActions.selectIdeology}
          onStartGame={gameActions.startGame}
        />
      );

    case 'playing':
      return (
        <Board
          roomState={gameState.roomState}
          localPlayerId={gameState.localPlayerId}
          gameActions={gameActions}
          turnResultsData={gameState.turnResultsData}
          hasAcknowledgedResults={gameState.hasAcknowledgedResults}
          afkPlayers={gameState.afkPlayers}
          dealBreachData={gameState.dealBreachData}
          crisisResolutionData={gameState.crisisResolutionData}
        />
      );

    case 'finished':
    case 'collapsed':
      return (
        <Results
          roomState={gameState.roomState}
          localPlayerId={gameState.localPlayerId}
          onPlayAgain={() => router.push('/create')}
          onHome={() => router.push('/')}
        />
      );

    default:
      return null;
  }
}
