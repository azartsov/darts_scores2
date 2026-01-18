"use client"

import { type Player, CHECKOUT_MAP } from "@/lib/game-types"
import { Card, CardContent } from "@/components/ui/card"
import { User, History } from "lucide-react"

interface PlayerCardProps {
  player: Player
  isActive: boolean
  position: number
}

export function PlayerCard({ player, isActive, position }: PlayerCardProps) {
  const checkout = player.currentScore <= 170 ? CHECKOUT_MAP[player.currentScore] : null
  const lastTurn = player.history[player.history.length - 1]

  return (
    <Card
      className={`transition-all duration-300 ${
        isActive
          ? "ring-2 ring-primary bg-card border-primary shadow-lg shadow-primary/20"
          : "bg-card/50 border-border opacity-75"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Player Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              <span className="text-sm font-bold">{position}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-foreground truncate">{player.name}</span>
              </div>
              {isActive && <span className="text-xs text-primary font-medium">Now throwing</span>}
            </div>
          </div>

          {/* Score Display */}
          <div className="text-right">
            <div
              className={`text-4xl md:text-5xl font-bold tabular-nums ${
                isActive ? "text-foreground" : "text-foreground/70"
              }`}
            >
              {player.currentScore}
            </div>
            {checkout && <div className="text-xs text-accent font-medium mt-1">{checkout}</div>}
          </div>
        </div>

        {/* Last Turn History */}
        {lastTurn && (
          <div
            className={`mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-sm ${
              lastTurn.wasBust ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            <History className="w-3 h-3" />
            <span>
              {lastTurn.darts.join(", ")} = {lastTurn.wasBust ? "BUST" : `-${lastTurn.total}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
