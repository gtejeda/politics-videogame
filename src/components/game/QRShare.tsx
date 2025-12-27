'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QRShareProps {
  roomId: string;
}

export function QRShare({ roomId }: QRShareProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');
  const [customHost, setCustomHost] = useState('');
  const [needsHostInput, setNeedsHostInput] = useState(false);
  const [hostConfirmed, setHostConfirmed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      // Check if accessing from localhost
      if (host.includes('localhost') || host.startsWith('127.')) {
        setNeedsHostInput(true);
        // Try to get saved host from localStorage
        const savedHost = localStorage.getItem('qr-share-host');
        if (savedHost) {
          setCustomHost(savedHost);
        }
      } else {
        // Using IP or domain, use it directly
        const protocol = window.location.protocol;
        setJoinUrl(`${protocol}//${host}/join?code=${roomId}`);
        setHostConfirmed(true);
      }
    }
  }, [roomId]);

  const handleConfirmHost = () => {
    if (customHost.trim()) {
      const protocol = window.location.protocol;
      const port = window.location.port;
      // Add port if custom host doesn't include one
      const hostWithPort = customHost.includes(':') ? customHost : `${customHost}:${port}`;
      setJoinUrl(`${protocol}//${hostWithPort}/join?code=${roomId}`);
      setHostConfirmed(true);
      // Save for future use
      localStorage.setItem('qr-share-host', customHost);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = roomId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShowQR = () => {
    if (needsHostInput && !hostConfirmed) {
      // Show input first
      setShowQR(true);
    } else {
      setShowQR(!showQR);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowQR}
        >
          {showQR ? 'Hide QR' : 'Show QR'}
        </Button>
      </div>

      {showQR && needsHostInput && !hostConfirmed && (
        <div className="w-full max-w-xs space-y-2 rounded-lg border p-4">
          <Label htmlFor="host-input" className="text-sm">
            Enter your local IP for QR code:
          </Label>
          <p className="text-xs text-muted-foreground">
            Run <code className="rounded bg-muted px-1">ipconfig getifaddr en0</code> to find it
          </p>
          <div className="flex gap-2">
            <Input
              id="host-input"
              type="text"
              placeholder="e.g., 192.168.1.100"
              value={customHost}
              onChange={(e) => setCustomHost(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmHost()}
            />
            <Button size="sm" onClick={handleConfirmHost}>
              OK
            </Button>
          </div>
        </div>
      )}

      {showQR && joinUrl && hostConfirmed && (
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-lg border bg-white p-4">
            <QRCodeSVG
              value={joinUrl}
              size={160}
              level="M"
              includeMargin={false}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {joinUrl}
          </p>
          {needsHostInput && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setHostConfirmed(false)}
            >
              Change IP
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
