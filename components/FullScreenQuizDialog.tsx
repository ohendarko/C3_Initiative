"use client"

import React, { useState } from "react"
import { Dialog } from "@headlessui/react"
import { Button } from "./ui/button"
import { useLearner } from "@/context/LearnerContext"
import { useRouter } from "next/navigation"
import SlideInQuestion from "./SlideInQuestion"

type Question = {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

type Props = {
  isOpen: boolean
  mode: string
  onClose: () => void
  onComplete: (score: number, mode: string) => void
  questions: Question[]
}

export default function FullScreenQuizDialog({
  isOpen,
  onClose,
  questions,
  onComplete,
  mode,
}: Props) {
  const router = useRouter()
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false)
  const { loading } = useLearner()

  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionSelect = (option: string) => {
    const updated = [...selectedAnswers]
    updated[currentQuestionIndex] = option
    setSelectedAnswers(updated)
    setHasCheckedAnswer(false)
    setShowExplanation(false)
  }

  const handleCheckAnswer = () => {
    setHasCheckedAnswer(true)
    setShowExplanation(true)
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const numCorrect = questions.reduce((total, q, i) => {
    return total + (selectedAnswers[i] === q.correctAnswer ? 1 : 0)
  }, 0)

  const isCorrect = (qIndex: number) =>
    selectedAnswers[qIndex] === questions[qIndex].correctAnswer

  const handleNext = () => {
    setCurrentQuestionIndex((i) => i + 1)
    setShowExplanation(false)
    setHasCheckedAnswer(false)
  }

  const handlePrev = () => {
    setCurrentQuestionIndex((i) => i - 1)
    setShowExplanation(false)
    setHasCheckedAnswer(false)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4">
          <div className="relative w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Module {mode === "pretest" ? "Pretest" : "Post Test"}
              </h2>
              <Button variant="outline" onClick={() => router.push('/learn/cervical-cancer')}>
                Back to Modules
              </Button>
            </div>

            {!isSubmitted && mode === "pretest" && (
              <p className="text-xs text-gray-500 mb-6">
                You must complete the pretest before you start the module!
              </p>
            )}

            {/* Question */}
            <SlideInQuestion keyId={currentQuestion?.question}>
              <div className="space-y-4">
                <p className="font-semibold text-lg">
                  {currentQuestionIndex + 1}. {currentQuestion?.question}
                </p>
                <div className="space-y-2">
                  {currentQuestion?.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className={`flex items-center p-2 border rounded-md cursor-pointer ${
                        selectedAnswers[currentQuestionIndex] === option
                          ? "border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={option}
                        disabled={isSubmitted}
                        checked={selectedAnswers[currentQuestionIndex] === option}
                        onChange={() => handleOptionSelect(option)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {showExplanation && selectedAnswers[currentQuestionIndex] && (
                  <div
                    className={`mt-2 p-3 rounded-md text-sm ${
                      isCorrect(currentQuestionIndex)
                        ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                        : "bg-red-50 text-red-700 border-l-4 border-red-500"
                    }`}
                  >
                    {currentQuestion.explanation}
                  </div>
                )}
              </div>
            </SlideInQuestion>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              {!hasCheckedAnswer ? (
                <Button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswers[currentQuestionIndex]}
                >
                  Check Answer
                </Button>
              ) : currentQuestionIndex < questions.length - 1 ? (
                <Button variant="outline" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                !isSubmitted &&
                selectedAnswers.length === questions.length && (
                  <Button
                    onClick={handleSubmit}
                    className="gradient-orange-blue text-white"
                  >
                    Submit Test
                  </Button>
                )
              )}
            </div>

            {/* Final Score */}
            {isSubmitted && (
              <div className="flex flex-col gap-4 mt-8 text-center text-lg font-medium">
                <p>
                  You scored {numCorrect} out of {questions.length}
                </p>

                {mode === "posttest" && (
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => window.location.reload()}
                  >
                    Retake Test
                  </Button>
                )}

                <Button
                  className="gradient-orange-blue text-white"
                  onClick={() => {
                    setIsLoading(true)
                    onComplete(numCorrect, mode)
                  }}
                  disabled={isLoading}
                >
                  {mode === "pretest" ? "Continue to Module" : "Finish Module"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
