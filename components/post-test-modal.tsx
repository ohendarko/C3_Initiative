"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, RotateCcw } from "lucide-react"

interface PostTestModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  moduleTitle: string
  moduleId: number
}

// Sample post-test questions for Module 1
const postTestQuestions = [
  {
    text: "How many women die from cervical cancer worldwide each year?",
    options: ["150,000", "266,000", "400,000", "500,000"],
    correct: 1,
  },
  {
    text: "What causes almost all cases of cervical cancer?",
    options: ["Genetic factors", "HPV infection", "Poor diet", "Environmental factors"],
    correct: 1,
  },
  {
    text: "How long does cervical cancer typically take to develop?",
    options: ["1-2 years", "5-7 years", "10-20 years", "25-30 years"],
    correct: 2,
  },
  {
    text: "When should HPV vaccines be given for maximum effectiveness?",
    options: ["After diagnosis", "During treatment", "Before sexual activity", "At any age"],
    correct: 2,
  },
  {
    text: "What is available to detect cervical pre-cancer early?",
    options: [
      "Expensive specialized tests",
      "Low-cost screening tests",
      "Only surgical procedures",
      "Blood tests only",
    ],
    correct: 1,
  },
]

export default function PostTestModal({ isOpen, onClose, onComplete, moduleTitle, moduleId }: PostTestModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < postTestQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    const correctAnswers = answers.filter((answer, index) => answer === postTestQuestions[index].correct).length
    const percentage = (correctAnswers / postTestQuestions.length) * 100
    setScore(percentage)
    setShowResults(true)
    setAttempts(attempts + 1)
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setScore(0)
  }

  const handleComplete = () => {
    onComplete()
    resetTest()
  }

  const resetTest = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setScore(0)
    setAttempts(0)
  }

  const handleClose = () => {
    resetTest()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Module Review: {moduleTitle}</DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Test your knowledge from this module. Complete all questions to finish the module.
            {attempts > 0 && ` Attempt ${attempts + 1}`}
          </p>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Question {currentQuestion + 1} of {postTestQuestions.length}
                </span>
                <span>{Math.round(((currentQuestion + 1) / postTestQuestions.length) * 100)}% Complete</span>
              </div>
              <Progress value={((currentQuestion + 1) / postTestQuestions.length) * 100} className="h-2" />
            </div>

            {/* Question */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">{postTestQuestions[currentQuestion].text}</h3>
                <div className="space-y-3">
                  {postTestQuestions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={answers[currentQuestion] === index ? "default" : "outline"}
                      className={`w-full text-left justify-start h-auto p-4 ${
                        answers[currentQuestion] === index ? "gradient-orange-blue text-white" : ""
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                className="gradient-orange-blue text-white"
              >
                {currentQuestion === postTestQuestions.length - 1 ? "Complete Module" : "Next"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results */}
            <Card className="border-2 border-green-500">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                </div>

                <h3 className="text-3xl font-bold mb-2 text-green-600">{score}%</h3>

                <p className="text-lg mb-4 text-green-600">Module Complete!</p>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>
                    Correct answers: {Math.round((score / 100) * postTestQuestions.length)} out of{" "}
                    {postTestQuestions.length}
                  </p>
                  <p>You have successfully completed this module.</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3">
              <Button variant="outline" onClick={handleRetry}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Review Questions
              </Button>
              <Button onClick={handleComplete} className="gradient-orange-blue text-white">
                Continue Learning
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
