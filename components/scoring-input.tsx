"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DartInput } from "@/lib/game-types"
import { CHECKOUT_MAP } from "@/lib/game-types"
import { Target, Send, RotateCcw, TrendingDown, Trophy, AlertTriangle } from "lucide-react"

interface ScoringInputProps {
  playerName: string
  currentScore: number
  onSubmitTurn: (darts: [number, number, number]) => void
}

const HIGH_VALUES = [20, 19, 18, 17, 16, 15]
const LOW_VALUES = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const SPECIAL_VALUES = [25, 50, 0]
const SPECIAL_LABELS: Record<number, string> = {
  25: "Bull",
  50: "Bullseye",
  0: "Miss",
}

export function ScoringInput({ playerName, currentScore, onSubmitTurn }: ScoringInputProps) {
  const [darts, setDarts] = useState<[DartInput, DartInput, DartInput]>([
    { value: 0, multiplier: 1 },
    { value: 0, multiplier: 1 },
    { value: 0, multiplier: 1 },
  ])
  const [activeDart, setActiveDart] = useState<0 | 1 | 2>(0)
  const [activeMultiplier, setActiveMultiplier] = useState<1 | 2 | 3>(1)

  const calculateDartScore = (dart: DartInput): number => {
    // Bull (25) can only be doubled to 50, not tripled
    if (dart.value === 25) {
      return dart.multiplier === 2 ? 50 : 25
    }
    // Bullseye (50) cannot be multiplied
    if (dart.value === 50) {
      return 50
    }
    return dart.value * dart.multiplier
  }

  const handleValueClick = (value: number) => {
    const newDarts = [...darts] as [DartInput, DartInput, DartInput]
    // Determine valid multiplier for this value
    let multiplier = activeMultiplier
    if (value === 50) {
      multiplier = 1 // Bullseye cannot be multiplied
    } else if (value === 25 && activeMultiplier === 3) {
      multiplier = 2 // Bull can only be doubled, not tripled
    } else if (value === 0) {
      multiplier = 1 // Miss is always 0
    }
    newDarts[activeDart] = { value, multiplier }
    setDarts(newDarts)
    // Auto-advance to next dart if not the last one
    if (activeDart < 2) {
      setActiveDart((activeDart + 1) as 0 | 1 | 2)
    }
  }

  const handleMultiplierToggle = (multiplier: 1 | 2 | 3) => {
    setActiveMultiplier(multiplier)
  }

  const handleSubmit = () => {
    const scores: [number, number, number] = [
      calculateDartScore(darts[0]),
      calculateDartScore(darts[1]),
      calculateDartScore(darts[2]),
    ]
    onSubmitTurn(scores)
    // Reset for next turn
    setDarts([
      { value: 0, multiplier: 1 },
      { value: 0, multiplier: 1 },
      { value: 0, multiplier: 1 },
    ])
    setActiveDart(0)
    setActiveMultiplier(1)
  }

  const handleClear = () => {
    setDarts([
      { value: 0, multiplier: 1 },
      { value: 0, multiplier: 1 },
      { value: 0, multiplier: 1 },
    ])
    setActiveDart(0)
    setActiveMultiplier(1)
  }

  const totalScore = darts.reduce((sum, dart) => sum + calculateDartScore(dart), 0)
  const projectedScore = currentScore - totalScore
  const isBust = projectedScore < 0 || projectedScore === 1
  const isWinning = projectedScore === 0
  const hasCheckout = projectedScore >= 2 && projectedScore <= 170 && CHECKOUT_MAP[projectedScore]

  const formatDartDisplay = (dart: DartInput): string => {
    if (dart.value === 0) return "-"
    if (dart.value === 50) return "Bull"
    if (dart.value === 25) return dart.multiplier === 2 ? "D25" : "25"
    const prefix = dart.multiplier === 2 ? "D" : dart.multiplier === 3 ? "T" : ""
    return `${prefix}${dart.value}`
  }

  // Get projected checkout suggestion
  const getProjectedCheckout = (): string | null => {
    if (projectedScore >= 2 && projectedScore <= 170) {
      return CHECKOUT_MAP[projectedScore] || null
    }
    return null
  }

  const handleMultiplierClick = (multiplier: 1 | 2 | 3) => {
    // Implement the logic for handleMultiplierClick here
    setActiveMultiplier(multiplier)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Target className="w-5 h-5 text-primary" />
          <span className="truncate">{playerName}&apos;s Turn</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Projected Score Display */}
        <div
          className={`p-4 rounded-lg border-2 transition-all ${
            isWinning
              ? "bg-primary/20 border-primary"
              : isBust
                ? "bg-destructive/20 border-destructive"
                : hasCheckout
                  ? "bg-amber-500/20 border-amber-500"
                  : "bg-secondary/50 border-border"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              Projected Score
            </span>
            <span
              className={`text-3xl font-bold ${
                isWinning ? "text-primary" : isBust ? "text-destructive" : "text-foreground"
              }`}
            >
              {projectedScore}
            </span>
          </div>

          {/* Status messages */}
          {isWinning && (
            <div className="flex items-center gap-2 text-primary text-sm font-medium">
              <Trophy className="w-4 h-4" />
              Winning throw!
            </div>
          )}

          {isBust && (
            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              BUST! Score will revert
            </div>
          )}

          {/* Checkout suggestion */}
          {!isBust && !isWinning && getProjectedCheckout() && (
            <div className="text-sm">
              <span className="text-muted-foreground">Finish: </span>
              <span className="text-amber-500 font-medium">{getProjectedCheckout()}</span>
            </div>
          )}
        </div>
        {/* Dart Score Display */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setActiveDart(index as 0 | 1 | 2)}
              className={`p-3 rounded-lg text-center transition-all ${
                activeDart === index
                  ? "bg-primary text-primary-foreground ring-2 ring-primary"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <div className="text-xs text-inherit opacity-70 mb-1">Dart {index + 1}</div>
              <div className="text-xl font-bold">{formatDartDisplay(darts[index])}</div>
              <div className="text-sm font-medium">{calculateDartScore(darts[index])}</div>
            </button>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
          <span className="text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-foreground">{totalScore}</span>
        </div>

        {/* High Value Buttons (15-20) */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">High Values</div>
          <div className="grid grid-cols-6 gap-1.5">
            {HIGH_VALUES.map((value) => (
              <Button
                key={value}
                variant="secondary"
                className="h-11 text-base font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleValueClick(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        {/* Low Value Buttons (1-14) */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">Low Values</div>
          <div className="grid grid-cols-7 gap-1.5">
            {LOW_VALUES.map((value) => (
              <Button
                key={value}
                variant="secondary"
                className="h-11 text-base font-medium bg-secondary/70 text-secondary-foreground hover:bg-secondary/50"
                onClick={() => handleValueClick(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        {/* Special Buttons (Bull, Bullseye, Miss) */}
        <div className="grid grid-cols-3 gap-2">
          {SPECIAL_VALUES.map((value) => (
            <Button
              key={value}
              variant="secondary"
              className={`h-11 text-base font-medium ${
                value === 0
                  ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                  : "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
              }`}
              onClick={() => handleValueClick(value)}
            >
              {SPECIAL_LABELS[value]}
            </Button>
          ))}
        </div>

        {/* Multiplier Toggle - Select before clicking numbers */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Multiplier Mode</span>
            <span className="text-foreground">
              Active: <span className="text-primary font-bold">{activeMultiplier === 1 ? "Single" : activeMultiplier === 2 ? "Double" : "Triple"}</span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([1, 2, 3] as const).map((mult) => (
              <Button
                key={mult}
                variant={activeMultiplier === mult ? "default" : "secondary"}
                className={`h-10 font-medium transition-all ${
                  activeMultiplier === mult
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                onClick={() => handleMultiplierToggle(mult)}
              >
                {mult === 1 ? "Single" : mult === 2 ? "Double" : "Triple"}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="h-12 bg-secondary text-secondary-foreground" onClick={handleClear}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button className="h-12 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" />
            Submit Turn
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
