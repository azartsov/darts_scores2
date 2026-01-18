"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GameType, Player } from "@/lib/game-types"
import { Target, Plus, Trash2, Users, Play, GripVertical } from "lucide-react"

interface GameSetupProps {
  onStartGame: (players: Player[], gameType: GameType) => void
}

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [gameType, setGameType] = useState<GameType>(501)
  const [playerNames, setPlayerNames] = useState<string[]>(["Player 1", "Player 2"])
  const [newPlayerName, setNewPlayerName] = useState("")

  const addPlayer = () => {
    if (playerNames.length >= 10) return
    const name = newPlayerName.trim() || `Player ${playerNames.length + 1}`
    setPlayerNames([...playerNames, name])
    setNewPlayerName("")
  }

  const removePlayer = (index: number) => {
    if (playerNames.length <= 2) return
    setPlayerNames(playerNames.filter((_, i) => i !== index))
  }

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames]
    updated[index] = name
    setPlayerNames(updated)
  }

  const handleStartGame = () => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}-${Date.now()}`,
      name: name.trim() || `Player ${index + 1}`,
      startingScore: gameType,
      currentScore: gameType,
      history: [],
    }))
    onStartGame(players, gameType)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card border-border">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Target className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl font-bold text-foreground">DartMaster Pro</CardTitle>
          </div>
          <p className="text-muted-foreground">Set up your game and start playing</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Game Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Game Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={gameType === 301 ? "default" : "secondary"}
                className={`h-16 text-2xl font-bold ${
                  gameType === 301
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                onClick={() => setGameType(301)}
              >
                301
              </Button>
              <Button
                type="button"
                variant={gameType === 501 ? "default" : "secondary"}
                className={`h-16 text-2xl font-bold ${
                  gameType === 501
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                onClick={() => setGameType(501)}
              >
                501
              </Button>
            </div>
          </div>

          {/* Player List */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Players ({playerNames.length}/10)
            </label>
            <div className="space-y-2">
              {playerNames.map((name, index) => (
                <div key={index} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground w-6">#{index + 1}</span>
                  <Input
                    value={name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    className="flex-1 bg-input border-border text-foreground"
                    placeholder={`Player ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePlayer(index)}
                    disabled={playerNames.length <= 2}
                    className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Player */}
            {playerNames.length < 10 && (
              <div className="flex gap-2">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder={`Player ${playerNames.length + 1}`}
                  className="flex-1 bg-input border-border text-foreground"
                  onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addPlayer}
                  className="bg-secondary text-secondary-foreground"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Start Game Button */}
          <Button
            onClick={handleStartGame}
            className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={playerNames.length < 2}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Game
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
