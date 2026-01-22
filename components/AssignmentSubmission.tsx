"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * AssignmentSubmission Component
 * 
 * Allows users to submit their work for evaluation.
 * Handles different submission formats based on assignment type.
 */
interface AssignmentSubmissionProps {
  assignment: any; // Assignment data (type varies by assignment type)
  assignmentType: string;
  onSubmit: (submission: any) => void;
  onCancel: () => void;
}

export function AssignmentSubmission({ assignment, assignmentType, onSubmit, onCancel }: AssignmentSubmissionProps) {
  // State for multiple choice answers
  const [mcAnswers, setMcAnswers] = useState<Record<number, string>>({});
  
  // State for essay text
  const [essayText, setEssayText] = useState("");
  
  // State for mixed test answers
  const [mixedAnswers, setMixedAnswers] = useState<Record<number, string>>({});
  
  // State for case study responses
  const [caseStudyResponses, setCaseStudyResponses] = useState<Record<number, string>>({});

  /**
   * Handle submission based on assignment type
   */
  const handleSubmit = () => {
    let submission: any = {};

    if (assignmentType === "multiple-choice" && "questions" in assignment) {
      // Validate all questions are answered
      const questions = assignment.questions;
      const unanswered = questions.filter((q: any) => !mcAnswers[q.number]);
      
      if (unanswered.length > 0) {
        alert(`Please answer all questions. You have ${unanswered.length} unanswered question(s).`);
        return;
      }

      submission = {
        type: "multiple-choice",
        answers: mcAnswers,
      };
    } else if (assignmentType === "essay") {
      if (!essayText.trim()) {
        alert("Please write your essay before submitting.");
        return;
      }

      submission = {
        type: "essay",
        text: essayText,
      };
    } else if (assignmentType === "test" && "questions" in assignment) {
      // For mixed tests, collect all answers
      const questions = assignment.questions;
      const unanswered = questions.filter((q: any) => !mixedAnswers[q.number]);
      
      if (unanswered.length > 0) {
        alert(`Please answer all questions. You have ${unanswered.length} unanswered question(s).`);
        return;
      }

      submission = {
        type: "test",
        answers: mixedAnswers,
      };
    } else if (assignmentType === "case-study" && "tasks" in assignment) {
      // For case studies, collect responses to each task
      const tasks = assignment.tasks;
      const unanswered = tasks.filter((_: any, index: number) => !caseStudyResponses[index + 1]);
      
      if (unanswered.length > 0) {
        alert(`Please respond to all tasks. You have ${unanswered.length} unanswered task(s).`);
        return;
      }

      submission = {
        type: "case-study",
        responses: caseStudyResponses,
      };
    } else {
      // For presentations and projects, allow text submission
      if (!essayText.trim()) {
        alert("Please provide your submission before submitting.");
        return;
      }

      submission = {
        type: assignmentType,
        text: essayText,
      };
    }

    onSubmit(submission);
  };

  // Multiple Choice Submission Form
  if (assignmentType === "multiple-choice" && "questions" in assignment) {
    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">
            Submit Your Answers
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Select your answer for each question below.
          </p>

          <div className="space-y-6">
            {assignment.questions.map((q: any) => (
              <div key={q.number} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="mb-3">
                  <span className="font-semibold text-primary">{q.number}.</span>
                  <span className="ml-2 text-slate-700 dark:text-slate-300">{q.question}</span>
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">({q.points} pts)</span>
                </div>
                <div className="space-y-2 ml-6">
                  {Object.entries(q.options).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${q.number}`}
                        value={key}
                        checked={mcAnswers[q.number] === key}
                        onChange={(e) => setMcAnswers({ ...mcAnswers, [q.number]: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-medium text-slate-600 dark:text-slate-400 min-w-[20px]">{key}.</span>
                      <span className="text-slate-700 dark:text-slate-300">{value as string}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Submit for Evaluation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mixed Test Submission Form
  if (assignmentType === "test" && "questions" in assignment) {
    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">
            Submit Your Answers
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Provide your answers for each question below.
          </p>

          <div className="space-y-6">
            {assignment.questions.map((q: any) => (
              <div key={q.number} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="mb-3">
                  <span className="font-semibold text-primary">{q.number}.</span>
                  <span className="ml-2 text-xs uppercase bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {q.type}
                  </span>
                  <span className="ml-2 text-slate-700 dark:text-slate-300">{q.question}</span>
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">({q.points} pts)</span>
                </div>
                <div className="ml-6">
                  {q.options ? (
                    // Multiple choice question
                    <div className="space-y-2">
                      {Object.entries(q.options).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${q.number}`}
                            value={key}
                            checked={mixedAnswers[q.number] === key}
                            onChange={(e) => setMixedAnswers({ ...mixedAnswers, [q.number]: e.target.value })}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="font-medium text-slate-600 dark:text-slate-400 min-w-[20px]">{key}.</span>
                          <span className="text-slate-700 dark:text-slate-300">{value as string}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    // Short answer or essay question
                    <textarea
                      value={mixedAnswers[q.number] || ""}
                      onChange={(e) => setMixedAnswers({ ...mixedAnswers, [q.number]: e.target.value })}
                      placeholder="Type your answer here..."
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      rows={q.type === "essay" ? 6 : 3}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Submit for Evaluation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Essay Submission Form
  if (assignmentType === "essay") {
    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">
            Submit Your Essay
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Write your essay in the text area below. Your submission will be evaluated based on the rubric.
          </p>

          <textarea
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            placeholder="Write your essay here..."
            className="w-full min-h-[400px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            rows={20}
          />

          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Word count: {essayText.trim().split(/\s+/).filter(Boolean).length} words
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={!essayText.trim()}>
              Submit for Evaluation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Case Study Submission Form
  if (assignmentType === "case-study" && "tasks" in assignment) {
    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">
            Submit Your Responses
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Provide your response to each task below.
          </p>

          <div className="space-y-6">
            {assignment.tasks.map((task: string, index: number) => (
              <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="mb-3">
                  <span className="font-semibold text-primary">{index + 1}.</span>
                  <span className="ml-2 text-slate-700 dark:text-slate-300">{task}</span>
                </div>
                <textarea
                  value={caseStudyResponses[index + 1] || ""}
                  onChange={(e) => setCaseStudyResponses({ ...caseStudyResponses, [index + 1]: e.target.value })}
                  placeholder="Type your response here..."
                  className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  rows={6}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Submit for Evaluation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default: Presentation/Project submission (text-based)
  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">
          Submit Your Work
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Provide your submission below. You can paste text, describe your work, or provide a summary.
        </p>

        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          placeholder="Describe your work, paste your content, or provide a summary..."
          className="w-full min-h-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={15}
        />

        <div className="flex gap-3 mt-6">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={!essayText.trim()}>
            Submit for Evaluation
          </Button>
        </div>
      </div>
    </div>
  );
}
