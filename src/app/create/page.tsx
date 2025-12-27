'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalPlayer } from '@/lib/hooks/useLocalPlayer';
import { generateRoomCode } from '@/lib/game/constants';

export default function CreateGamePage() {
  const router = useRouter();
  const { state: localPlayer, isLoaded, setDisplayName, setLastRoomId } = useLocalPlayer();
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill name from localStorage
  useEffect(() => {
    if (isLoaded && localPlayer?.displayName) {
      setName(localPlayer.displayName);
    }
  }, [isLoaded, localPlayer?.displayName]);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Save the display name
      setDisplayName(name.trim());

      // Generate a room code
      const roomCode = generateRoomCode();

      // Save for potential reconnection
      setLastRoomId(roomCode);

      // Navigate to the room
      router.push(`/room/${roomCode}`);
    } catch (err) {
      setError('Failed to create game. Please try again.');
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create New Game</CardTitle>
          <CardDescription>
            Start a new game and invite 2-4 other players
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={20}
              disabled={isCreating}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleCreate}
            disabled={isCreating || !name.trim()}
          >
            {isCreating ? 'Creating...' : 'Create Game'}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push('/')}
            disabled={isCreating}
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
