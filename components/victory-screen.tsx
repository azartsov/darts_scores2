"use client"

import type { Player } from "@/lib/game-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, RotateCcw, Home } from "lucide-react"

interface VictoryScreenProps {
  winner: Player
  onRematch: () => void
  onNewGame: () => void
}

export function VictoryScreen({ winner, onRematch, onNewGame }: VictoryScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border text-center">
        <CardContent className="pt-8 pb-6 space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center animate-pulse">
              <Trophy className="w-10 h-10 text-accent-foreground" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Winner!</h1>
            <p className="text-xl text-primary font-medium">{winner.name}</p>
          </div>

          <p className="text-muted-foreground">Finished with a double out in {winner.history.length} turns</p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button variant="secondary" className="h-12 bg-secondary text-secondary-foreground" onClick={onRematch}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Rematch
            </Button>
            <Button className="h-12 bg-primary text-primary-foreground" onClick={onNewGame}>
              <Home className="w-4 h-4 mr-2" />
              New Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
