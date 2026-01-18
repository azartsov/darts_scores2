"use client"

import { useState, useEffect, useCallback } from "react"
import { GameSetup } from "@/components/game-setup"
import { GameBoard } from "@/components/game-board"
import { VictoryScreen } from "@/components/victory-screen"
import type { GameState, Player, GameType, TurnHistory } from "@/lib/game-types"
import { saveGameState, loadGameState, clearGameState } from "@/lib/game-storage"

const initialGameState: GameState = {
  phase: "setup",
  gameType: 501,
  players: [],
  activePlayerIndex: 0,
  winner: null,
}

export default function DartMasterPro() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [undoStack, setUndoStack] = useState<GameState[]>([])

  // Load game state from session storage on mount
  useEffect(() => {
    const saved = loadGameState()
    if (saved) {
      setGameState(saved)
    }
  }, [])

  // Save game state to session storage whenever it changes
  useEffect(() => {
    if (gameState.phase !== "setup") {
      saveGameState(gameState)
    }
  }, [gameState])

  const handleStartGame = useCallback((players: Player[], gameType: GameType) => {
    const newState: GameState = {
      phase: "playing",
      gameType,
      players,
      activePlayerIndex: 0,
      winner: null,
    }
    setGameState(newState)
    setUndoStack([])
  }, [])

  const handleSubmitTurn = useCallback((darts: [number, number, number]) => {
    setGameState((prev) => {
      // Save current state to undo stack
      setUndoStack((stack) => [...stack.slice(-9), prev])

      const activePlayer = prev.players[prev.activePlayerIndex]
      const totalScore = darts.reduce((sum, d) => sum + d, 0)
      const newScore = activePlayer.currentScore - totalScore

      // Check for bust conditions
      const isBust = newScore < 0 || newScore === 1

      // Check for win - must finish on exactly 0
      // In a real implementation, we'd also check if the last dart was a double
      // For simplicity, we assume the player knows to finish on a double
      const isWin = newScore === 0

      const turnHistory: TurnHistory = {
        darts,
        total: totalScore,
        scoreAfter: isBust ? activePlayer.currentScore : newScore,
        wasBust: isBust,
      }

      const updatedPlayers = prev.players.map((player, index) => {
        if (index === prev.activePlayerIndex) {
          return {
            ...player,
            currentScore: isBust ? player.currentScore : newScore,
            history: [...player.history, turnHistory],
          }
        }
        return player
      })

      if (isWin) {
        return {
          ...prev,
          phase: "finished",
          players: updatedPlayers,
          winner: updatedPlayers[prev.activePlayerIndex],
        }
      }

      // Move to next player
      const nextPlayerIndex = (prev.activePlayerIndex + 1) % prev.players.length

      return {
        ...prev,
        players: updatedPlayers,
        activePlayerIndex: nextPlayerIndex,
      }
    })
  }, [])

  const handleUndo = useCallback(() => {
    const prevState = undoStack[undoStack.length - 1]
    if (prevState) {
      setGameState(prevState)
      setUndoStack((stack) => stack.slice(0, -1))
    }
  }, [undoStack])

  const handleNewGame = useCallback(() => {
    clearGameState()
    setGameState(initialGameState)
    setUndoStack([])
  }, [])

  const handleResetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: "playing",
      activePlayerIndex: 0,
      winner: null,
      players: prev.players.map((player) => ({
        ...player,
        currentScore: player.startingScore,
        history: [],
      })),
    }))
    setUndoStack([])
  }, [])

  // Render based on game phase
  if (gameState.phase === "setup") {
    return <GameSetup onStartGame={handleStartGame} />
  }

  if (gameState.phase === "finished" && gameState.winner) {
    return <VictoryScreen winner={gameState.winner} onRematch={handleResetGame} onNewGame={handleNewGame} />
  }

  return (
    <GameBoard
      players={gameState.players}
      activePlayerIndex={gameState.activePlayerIndex}
      gameType={gameState.gameType}
      onSubmitTurn={handleSubmitTurn}
      onUndo={handleUndo}
      onNewGame={handleNewGame}
      onResetGame={handleResetGame}
      canUndo={undoStack.length > 0}
    />
  )
}
