"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Undo2, MoreVertical, RotateCcw, Home, HelpCircle } from "lucide-react"

interface GameControlsProps {
  onUndo: () => void
  onNewGame: () => void
  onResetGame: () => void
  canUndo: boolean
}

export function GameControls({ onUndo, onNewGame, onResetGame, canUndo }: GameControlsProps) {
  const [showRules, setShowRules] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <Undo2 className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Undo</span>
      </Button>

      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="w-4 h-4 mr-2" />
                How to Play
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onResetGame} className="cursor-pointer">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Scores
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onNewGame} className="cursor-pointer">
              <Home className="w-4 h-4 mr-2" />
              New Game
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">How to Play</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Standard darts rules with Double Out
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-foreground">
            <div>
              <h4 className="font-semibold text-primary mb-1">Objective</h4>
              <p className="text-muted-foreground">
                Reduce your score from 301 or 501 to exactly zero. The final dart must land in a double segment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Scoring</h4>
              <p className="text-muted-foreground">
                Each turn, throw 3 darts. Enter the value of each dart (1-20, 25 for bull, 50 for bullseye) and select
                single, double, or triple multiplier.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Bust Rule</h4>
              <p className="text-muted-foreground">
                If your score goes below 2 or to exactly 1, it&apos;s a bust. Your score reverts to what it was at the
                start of your turn.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Checkout</h4>
              <p className="text-muted-foreground">
                When your score is 170 or less, checkout suggestions appear to help you finish with a double.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
