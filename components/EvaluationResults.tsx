"use client";

import { Button } from "@/components/ui/button";

/**
 * EvaluationResults Component
 * 
 * Displays the AI evaluation results including scores, feedback, and rubric-based assessment.
 */
interface EvaluationResultsProps {
  results: {
    totalScore: number;
    maxScore: number;
    percentage: number;
    feedback: string;
    rubricScores: Array<{
      category: string;
      score: number;
      maxScore: number;
      feedback: string;
    }>;
    detailedFeedback?: string;
  };
  assignmentType: string;
  onBack: () => void;
}

export function EvaluationResults({ results, assignmentType, onBack }: EvaluationResultsProps) {
  // Determine grade letter
  const getGradeLetter = (percentage: number): string => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // Determine grade color
  const getGradeColor = (percentage: number): string => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400";
    if (percentage >= 80) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400";
    if (percentage >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="w-full max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Score Summary */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg border border-primary/20 p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Evaluation Results
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your submission has been evaluated
            </p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${getGradeColor(results.percentage)}`}>
              {results.percentage}%
            </div>
            <div className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mt-1">
              {getGradeLetter(results.percentage)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {results.totalScore} / {results.maxScore} points
            </div>
          </div>
        </div>
      </div>

      {/* Overall Feedback */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
          Overall Feedback
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {results.feedback}
          </p>
        </div>
      </div>

      {/* Detailed Feedback (if available) */}
      {results.detailedFeedback && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
            Detailed Analysis
          </h3>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {results.detailedFeedback}
            </p>
          </div>
        </div>
      )}

      {/* Rubric-Based Scores */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50">
          Rubric-Based Assessment
        </h3>
        <div className="space-y-4">
          {results.rubricScores.map((item, index) => {
            const itemPercentage = (item.score / item.maxScore) * 100;
            return (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                    {item.category}
                  </h4>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-slate-50">
                      {item.score} / {item.maxScore} pts
                    </span>
                    <span className={`ml-2 text-sm font-medium ${getGradeColor(itemPercentage)}`}>
                      ({Math.round(itemPercentage)}%)
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        itemPercentage >= 90
                          ? "bg-green-500"
                          : itemPercentage >= 80
                          ? "bg-blue-500"
                          : itemPercentage >= 70
                          ? "bg-yellow-500"
                          : itemPercentage >= 60
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${itemPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.feedback}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back to Assignment
        </Button>
        <Button
          onClick={() => {
            const resultsText = `
EVALUATION RESULTS
==================

Score: ${results.totalScore} / ${results.maxScore} points (${results.percentage}%)
Grade: ${getGradeLetter(results.percentage)}

OVERALL FEEDBACK:
${results.feedback}

${results.detailedFeedback ? `\nDETAILED ANALYSIS:\n${results.detailedFeedback}\n` : ""}

RUBRIC-BASED ASSESSMENT:
${results.rubricScores.map((item, i) => `${i + 1}. ${item.category}: ${item.score} / ${item.maxScore} pts\n   ${item.feedback}`).join("\n\n")}
            `.trim();
            navigator.clipboard.writeText(resultsText);
            alert("Results copied to clipboard!");
          }}
          variant="outline"
          className="flex-1"
        >
          Copy Results
        </Button>
      </div>
    </div>
  );
}
