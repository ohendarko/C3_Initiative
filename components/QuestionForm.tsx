import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const QuestionForm = ({ type, questions, onChange, onRemove }: any) => {
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedOptions = [...questions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    onChange(type, questionIndex, "options", updatedOptions);
  };

  const addOption = (questionIndex: number) => {
    const updatedOptions = [...questions[questionIndex].options, ""];
    onChange(type, questionIndex, "options", updatedOptions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedOptions = questions[questionIndex].options.filter((_: any, i: number) => i !== optionIndex);
    onChange(type, questionIndex, "options", updatedOptions);
  };

  return (
    <div className="space-y-4">
      {questions.map((q: any, questionIndex: number) => (
        <div key={questionIndex} className="border p-4 rounded-md bg-muted space-y-2">
          <p className="text-sm font-medium">Question</p>
          <Input
            value={q.question}
            onChange={(e) => onChange(type, questionIndex, "question", e.target.value)}
            placeholder="Question"
          />

          <div className="space-y-2">
            <p className="text-sm font-medium mt-5">Options:</p>
            {q.options.map((option: string, optionIndex: number) => (
              <div key={optionIndex} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeOption(questionIndex, optionIndex)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addOption(questionIndex)}>
              Add Option
            </Button>
          </div>
          <p className="text-sm font-medium !mt-5">Correct Answer</p>
          <Input
            value={q.correctAnswer}
            onChange={(e) => onChange(type, questionIndex, "correctAnswer", e.target.value)}
            placeholder="Correct Answer"
          />

          <p className="text-sm font-medium !mt-5">Explanation</p>
          <Textarea
            value={q.explanation || ""}
            onChange={(e) => onChange(type, questionIndex, "explanation", e.target.value)}
            placeholder="Explanation (optional)"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRemove(type, questionIndex)}
          >
            Remove Question
          </Button>
        </div>
      ))}
    </div>
  );
};

export default QuestionForm;
