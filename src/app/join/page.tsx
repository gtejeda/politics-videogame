'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalPlayer } from '@/lib/hooks/useLocalPlayer';

function JoinGameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: localPlayer, isLoaded, setDisplayName, setLastRoomId } = useLocalPlayer();
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill room code from query string
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setRoomCode(codeFromUrl.toUpperCase());
    }
  }, [searchParams]);

  // Pre-fill name from localStorage
  useEffect(() => {
    if (isLoaded && localPlayer?.displayName) {
      setName(localPlayer.displayName);
    }
  }, [isLoaded, localPlayer?.displayName]);

  const handleJoin = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }

    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode || cleanCode.length !== 6) {
      setError('Please enter a valid 6-character room code');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      // Save the display name
      setDisplayName(name.trim());

      // Save for potential reconnection
      setLastRoomId(cleanCode);

      // Navigate to the room
      router.push(`/room/${cleanCode}`);
    } catch (err) {
      setError('Failed to join game. Please check the room code.');
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
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
          <CardTitle>Join Game</CardTitle>
          <CardDescription>
            Enter the room code shared by the host
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
              maxLength={20}
              disabled={isJoining}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Room Code</Label>
            <Input
              id="code"
              placeholder="Enter 6-character code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              maxLength={6}
              disabled={isJoining}
              className="text-center text-2xl tracking-widest uppercase"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleJoin}
            disabled={isJoining || !name.trim() || roomCode.length !== 6}
          >
            {isJoining ? 'Joining...' : 'Join Game'}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push('/')}
            disabled={isJoining}
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function JoinGamePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <JoinGameContent />
    </Suspense>
  );
}
