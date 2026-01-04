"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

interface QuizModalProps {
  isOpen: boolean
  question: {
    text: string
    options: string[]
    correct: number
    explanation: string
  }
  onComplete: (correct: boolean) => void
  onClose: () => void
}

export default function QuizModal({ isOpen, question, onComplete, onClose }: QuizModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === question.correct
    setIsCorrect(correct)
    setShowResult(true)
  }

  const handleContinue = () => {
    onComplete(isCorrect)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleClose = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    onClose()
  }

  if (!question) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quick Knowledge Check</DialogTitle>
        </DialogHeader>

        {!showResult ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`w-full text-left justify-start h-auto p-4 ${
                        selectedAnswer === index ? "gradient-orange-blue text-white" : ""
                      }`}
                      onClick={() => setSelectedAnswer(index)}
                    >
                      <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="gradient-orange-blue text-white"
              >
                Submit Answer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className={`border-2 ${isCorrect ? "border-green-500" : "border-red-500"}`}>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  {isCorrect ? (
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                  )}
                </div>

                <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4">{question.explanation}</p>

                {!isCorrect && (
                  <p className="text-sm text-gray-500">
                    The correct answer was: <strong>{question.options[question.correct]}</strong>
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleContinue} className="gradient-orange-blue text-white">
                Continue Learning
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
