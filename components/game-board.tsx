"use client"

import type { Player, GameType } from "@/lib/game-types"
import { PlayerCard } from "./player-card"
import { ScoringInput } from "./scoring-input"
import { GameControls } from "./game-controls"
import { Target } from "lucide-react"

interface GameBoardProps {
  players: Player[]
  activePlayerIndex: number
  gameType: GameType
  onSubmitTurn: (darts: [number, number, number]) => void
  onUndo: () => void
  onNewGame: () => void
  onResetGame: () => void
  canUndo: boolean
}

export function GameBoard({
  players,
  activePlayerIndex,
  gameType,
  onSubmitTurn,
  onUndo,
  onNewGame,
  onResetGame,
  canUndo,
}: GameBoardProps) {
  const activePlayer = players[activePlayerIndex]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">DartMaster Pro</h1>
            <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-sm font-medium rounded">{gameType}</span>
          </div>
          <GameControls onUndo={onUndo} onNewGame={onNewGame} onResetGame={onResetGame} canUndo={canUndo} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr,380px] gap-6">
          {/* Players List */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Players</h2>
            <div className="space-y-3">
              {players.map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isActive={index === activePlayerIndex}
                  position={index + 1}
                />
              ))}
            </div>
          </div>

          {/* Scoring Input - sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ScoringInput playerName={activePlayer.name} currentScore={activePlayer.currentScore} onSubmitTurn={onSubmitTurn} />
          </div>
        </div>
      </main>
    </div>
  )
}
