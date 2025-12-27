import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            The Political Path
          </h1>
          <p className="text-muted-foreground">
            Race to political victory through negotiation and strategy
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/create"
            className="block w-full rounded-lg bg-primary px-4 py-3 text-center font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create Game
          </Link>

          <Link
            href="/join"
            className="block w-full rounded-lg border border-input bg-background px-4 py-3 text-center font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Join Game
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            3-5 players • 45-60 minutes • Real-time multiplayer
          </p>
        </div>
      </div>
    </div>
  )
}
