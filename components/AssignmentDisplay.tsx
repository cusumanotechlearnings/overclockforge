"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AssignmentSubmission } from "@/components/AssignmentSubmission";
import { EvaluationResults } from "@/components/EvaluationResults";

/**
 * AssignmentDisplay Component
 * 
 * Displays a generated assignment with different layouts based on assignment type.
 * Supports: case studies, multiple choice tests, essays, mixed tests, presentations, and projects.
 */
interface RubricLevel {
  points: number;
  description: string;
}

interface RubricCategory {
  name: string;
  points: number;
  levels: {
    exemplary: RubricLevel;
    proficient: RubricLevel;
    developing: RubricLevel;
    beginning: RubricLevel;
  };
}

interface Rubric {
  categories: RubricCategory[];
  totalPoints: number;
}

// Base assignment structure (for case studies, essays, presentations, projects)
interface BaseAssignment {
  title: string;
  objectives: string[];
  rubric: Rubric;
}

// Case study specific
interface CaseStudyAssignment extends BaseAssignment {
  scenario: string;
  tasks: string[];
}

// Multiple choice specific
interface MultipleChoiceAssignment extends BaseAssignment {
  instructions: string;
  questions: Array<{
    number: number;
    question: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    correctAnswer: string;
    points: number;
    explanation?: string;
  }>;
  answerKey: Record<string, string>;
}

// Essay specific
interface EssayAssignment extends BaseAssignment {
  prompt: string;
  requirements: string[];
}

// Mixed test specific
interface MixedTestAssignment extends BaseAssignment {
  instructions: string;
  questions: Array<{
    type: string;
    number: number;
    question: string;
    points: number;
    options?: Record<string, string>;
    correctAnswer?: string;
  }>;
  answerKey: Record<string, string>;
}

// Presentation specific
interface PresentationAssignment extends BaseAssignment {
  topic: string;
  requirements: string[];
}

// Project specific
interface ProjectAssignment extends BaseAssignment {
  description: string;
  requirements: string[];
}

type Assignment = CaseStudyAssignment | MultipleChoiceAssignment | EssayAssignment | MixedTestAssignment | PresentationAssignment | ProjectAssignment;

interface AssignmentDisplayProps {
  assignment: Assignment;
  query: string;
  assignmentType: string;
  onGenerateNew: () => void;
}

export function AssignmentDisplay({ assignment, query, assignmentType, onGenerateNew }: AssignmentDisplayProps) {
  // State for submission flow
  const [showSubmission, setShowSubmission] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState<any>(null);

  // Defensive check: ensure assignment has required properties
  if (!assignment || !assignment.title || !assignment.objectives || !assignment.rubric) {
    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-300">
            Error: Invalid assignment data. Please generate a new assignment.
          </p>
          <Button onClick={onGenerateNew} className="mt-4">
            Generate New Assignment
          </Button>
        </div>
      </div>
    );
  }

  // Ensure assignmentType is valid
  const validTypes = ["case-study", "multiple-choice", "essay", "test", "presentation", "project"];
  const safeAssignmentType = validTypes.includes(assignmentType) ? assignmentType : "case-study";

  /**
   * Handle submission from the submission component
   */
  const handleSubmission = async (submission: any) => {
    setIsEvaluating(true);
    setShowSubmission(false);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignment,
          submission,
          assignmentType: safeAssignmentType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to evaluate submission.");
      }

      if (data.success && data.results) {
        setEvaluationResults(data.results);
        setIsEvaluating(false);
      } else {
        throw new Error("Invalid response from evaluation API.");
      }
    } catch (error) {
      console.error("Error evaluating submission:", error);
      alert(error instanceof Error ? error.message : "Failed to evaluate submission. Please try again.");
      setIsEvaluating(false);
    }
  };

  /**
   * Handle canceling submission
   */
  const handleCancelSubmission = () => {
    setShowSubmission(false);
  };

  /**
   * Handle going back from results
   */
  const handleBackFromResults = () => {
    setEvaluationResults(null);
    setShowSubmission(false);
  };

  // If we have evaluation results, show them
  if (evaluationResults) {
    return (
      <EvaluationResults
        results={evaluationResults}
        assignmentType={safeAssignmentType}
        onBack={handleBackFromResults}
      />
    );
  }

  // If we're showing submission form, show it
  if (showSubmission) {
    return (
      <AssignmentSubmission
        assignment={assignment}
        assignmentType={safeAssignmentType}
        onSubmit={handleSubmission}
        onCancel={handleCancelSubmission}
      />
    );
  }

  // If we're evaluating, show loading state
  if (isEvaluating) {
    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 shadow-sm text-center">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-12 w-12 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Evaluating Your Submission...
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The AI is analyzing your work and providing detailed feedback.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Function to copy assignment text to clipboard
  const handleCopyAssignment = async () => {
    if (!assignment) return;
    
    let assignmentText = `\n${assignment.title}\n\n`;

    if (assignmentType === "multiple-choice" && "questions" in assignment && assignment.questions) {
      const mc = assignment as MultipleChoiceAssignment;
      assignmentText += `INSTRUCTIONS:\n${mc.instructions}\n\n`;
      assignmentText += `OBJECTIVES:\n${assignment.objectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}\n\n`;
      assignmentText += `QUESTIONS:\n${mc.questions.map(q => 
        `${q.number}. ${q.question}\nA. ${q.options.A}\nB. ${q.options.B}\nC. ${q.options.C}\nD. ${q.options.D}\n`
      ).join("\n")}\n\n`;
      assignmentText += `ANSWER KEY:\n${Object.entries(mc.answerKey).map(([num, ans]) => `${num}. ${ans}`).join("\n")}\n`;
    } else if (assignmentType === "essay" && "prompt" in assignment && assignment.prompt) {
      const essay = assignment as EssayAssignment;
      assignmentText += `ESSAY PROMPT:\n${essay.prompt}\n\n`;
      assignmentText += `OBJECTIVES:\n${assignment.objectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}\n\n`;
      assignmentText += `REQUIREMENTS:\n${essay.requirements.map((req, i) => `${i + 1}. ${req}`).join("\n")}\n`;
    } else if (assignmentType === "test" && "questions" in assignment && assignment.questions) {
      const test = assignment as MixedTestAssignment;
      assignmentText += `INSTRUCTIONS:\n${test.instructions}\n\n`;
      assignmentText += `OBJECTIVES:\n${assignment.objectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}\n\n`;
      assignmentText += `QUESTIONS:\n${test.questions.map(q => {
        let qText = `${q.number}. [${q.type}] ${q.question}`;
        if (q.options) {
          qText += `\n${Object.entries(q.options).map(([key, val]) => `${key}. ${val}`).join("\n")}`;
        }
        return qText;
      }).join("\n\n")}\n\n`;
      assignmentText += `ANSWER KEY:\n${Object.entries(test.answerKey).map(([num, ans]) => `${num}. ${ans}`).join("\n")}\n`;
    } else if (assignmentType === "presentation" && "topic" in assignment && assignment.topic) {
      const pres = assignment as PresentationAssignment;
      assignmentText += `PRESENTATION TOPIC:\n${pres.topic}\n\n`;
      assignmentText += `OBJECTIVES:\n${assignment.objectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}\n\n`;
      assignmentText += `REQUIREMENTS:\n${pres.requirements.map((req, i) => `${i + 1}. ${req}`).join("\n")}\n`;
    } else if (assignmentType === "project" && "description" in assignment && assignment.description) {
      const proj = assignment as ProjectAssignment;
      assignmentText += `PROJECT DESCRIPTION:\n${proj.description}\n\n`;
      assignmentText += `OBJECTIVES:\n${assignment.objectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}\n\n`;
      assignmentText += `REQUIREMENTS:\n${proj.requirements.map((req, i) => `${i + 1}. ${req}`).join("\n")}\n`;
    } else {
      // Case study (default)
      const cs = assignment as CaseStudyAssignment;
      if (cs.scenario) {
        assignmentText += `CASE STUDY SCENARIO:\n${cs.scenario}\n\n`;
      }
      assignmentText += `OBJECTIVES:\n${(assignment.objectives || []).map((obj, i) => `${i + 1}. ${obj}`).join("\n")}\n\n`;
      if (cs.tasks && cs.tasks.length > 0) {
        assignmentText += `TASKS:\n${cs.tasks.map((task, i) => `${i + 1}. ${task}`).join("\n")}\n`;
      }
    }

    if (assignment.rubric && assignment.rubric.categories) {
      assignmentText += `\n\nGRADING RUBRIC (Total: ${assignment.rubric.totalPoints || 100} points):\n${assignment.rubric.categories.map(cat => `
${cat.name} (${cat.points} points):
  Exemplary (${cat.levels.exemplary.points} pts): ${cat.levels.exemplary.description}
  Proficient (${cat.levels.proficient.points} pts): ${cat.levels.proficient.description}
  Developing (${cat.levels.developing.points} pts): ${cat.levels.developing.description}
  Beginning (${cat.levels.beginning.points} pts): ${cat.levels.beginning.description}
`).join("\n")}`;
    }

    try {
      await navigator.clipboard.writeText(assignmentText);
      alert("Assignment copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Could not copy to clipboard. Please select and copy manually.");
    }
  };

  // Get assignment type display name
  const getTypeDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      "case-study": "Case Study",
      "multiple-choice": "Multiple Choice Test",
      "essay": "Essay",
      "test": "Mixed Test",
      "presentation": "Presentation",
      "project": "Project",
    };
    return typeMap[type] || "Assignment";
  };

  return (
    <div className="w-full max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {assignment.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Type: {getTypeDisplayName(safeAssignmentType)}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setShowSubmission(true)}
              size="sm"
            >
              Submit Assignment
            </Button>
            <Button
              onClick={handleCopyAssignment}
              variant="outline"
              size="sm"
            >
              Copy Assignment
            </Button>
            <Button
              onClick={onGenerateNew}
              variant="outline"
              size="sm"
            >
              Generate New
            </Button>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Generated from query: &quot;{query}&quot;
        </p>
      </div>

      {/* Multiple Choice Test Display */}
      {safeAssignmentType === "multiple-choice" && "questions" in assignment && assignment.questions && Array.isArray(assignment.questions) && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
              Test Instructions
            </h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {(assignment as MultipleChoiceAssignment).instructions}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50">
              Questions
            </h3>
            <div className="space-y-6">
              {(assignment as MultipleChoiceAssignment).questions.map((q) => (
                <div key={q.number} className="border-l-4 border-primary pl-4">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="font-semibold text-primary">{q.number}.</span>
                    <p className="text-slate-700 dark:text-slate-300 flex-1">{q.question}</p>
                    <span className="text-sm text-slate-500 dark:text-slate-400">({q.points} pts)</span>
                  </div>
                  <div className="space-y-2 ml-6">
                    {Object.entries(q.options).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2">
                        <span className="font-medium text-slate-600 dark:text-slate-400 min-w-[20px]">{key}.</span>
                        <span className="text-slate-700 dark:text-slate-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50">
              Answer Key
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries((assignment as MultipleChoiceAssignment).answerKey).map(([num, ans]) => (
                <div key={num} className="flex gap-2">
                  <span className="font-medium text-slate-600 dark:text-slate-400">{num}.</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{ans}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mixed Test Display */}
      {safeAssignmentType === "test" && "questions" in assignment && assignment.questions && Array.isArray(assignment.questions) && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
              Test Instructions
            </h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {(assignment as MixedTestAssignment).instructions}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50">
              Questions
            </h3>
            <div className="space-y-6">
              {(assignment as MixedTestAssignment).questions.map((q) => (
                <div key={q.number} className="border-l-4 border-primary pl-4">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="font-semibold text-primary">{q.number}.</span>
                    <span className="text-xs uppercase bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {q.type}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-auto">({q.points} pts)</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 ml-6 mb-2">{q.question}</p>
                  {q.options && (
                    <div className="space-y-2 ml-6">
                      {Object.entries(q.options).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <span className="font-medium text-slate-600 dark:text-slate-400 min-w-[20px]">{key}.</span>
                          <span className="text-slate-700 dark:text-slate-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50">
              Answer Key
            </h3>
            <div className="space-y-2">
              {Object.entries((assignment as MixedTestAssignment).answerKey).map(([num, ans]) => (
                <div key={num} className="flex gap-2">
                  <span className="font-medium text-slate-600 dark:text-slate-400 min-w-[40px]">{num}.</span>
                  <span className="text-slate-700 dark:text-slate-300">{ans}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Essay Display */}
      {safeAssignmentType === "essay" && "prompt" in assignment && assignment.prompt && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
              Essay Prompt
            </h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {(assignment as EssayAssignment).prompt}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
              Requirements
            </h3>
            <ul className="space-y-2">
              {(assignment as EssayAssignment).requirements.map((req, index) => (
                <li key={index} className="flex gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-primary font-semibold min-w-[24px]">{index + 1}.</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Presentation Display */}
      {safeAssignmentType === "presentation" && "topic" in assignment && assignment.topic && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
              Presentation Topic
            </h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {(assignment as PresentationAssignment).topic}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
              Requirements
            </h3>
            <ul className="space-y-2">
              {(assignment as PresentationAssignment).requirements.map((req, index) => (
                <li key={index} className="flex gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-primary font-semibold min-w-[24px]">{index + 1}.</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Project Display */}
      {safeAssignmentType === "project" && "description" in assignment && assignment.description && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
              Project Description
            </h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {(assignment as ProjectAssignment).description}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
              Requirements
            </h3>
            <ul className="space-y-2">
              {(assignment as ProjectAssignment).requirements.map((req, index) => (
                <li key={index} className="flex gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-primary font-semibold min-w-[24px]">{index + 1}.</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Case Study Display (default) */}
      {safeAssignmentType === "case-study" && "scenario" in assignment && assignment.scenario && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
              Case Study Scenario
            </h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {(assignment as CaseStudyAssignment).scenario}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
              Assignment Tasks
            </h3>
            <ol className="space-y-3">
              {(assignment as CaseStudyAssignment).tasks.map((task, index) => (
                <li key={index} className="flex gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-primary font-semibold min-w-[24px]">{index + 1}.</span>
                  <span>{task}</span>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}

      {/* Objectives (shown for all types) */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
          Learning Objectives
        </h3>
        <ul className="space-y-2">
          {(assignment.objectives || []).map((objective, index) => (
            <li key={index} className="flex gap-3 text-slate-700 dark:text-slate-300">
              <span className="text-primary font-semibold min-w-[24px]">{index + 1}.</span>
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Grading Rubric (shown for all types) */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Grading Rubric
          </h3>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total: {assignment.rubric.totalPoints} points
          </span>
        </div>
        
        <div className="space-y-6">
          {(assignment.rubric?.categories || []).map((category, catIndex) => (
            <div key={catIndex} className="border-t border-slate-200 dark:border-slate-700 pt-4 first:border-t-0 first:pt-0">
              <h4 className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-50">
                {category.name} <span className="text-sm font-normal text-slate-600 dark:text-slate-400">({category.points} points)</span>
              </h4>
              
              <div className="grid gap-3">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-green-900 dark:text-green-300">Exemplary</span>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">{category.levels.exemplary.points} pts</span>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-300">{category.levels.exemplary.description}</p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-blue-900 dark:text-blue-300">Proficient</span>
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">{category.levels.proficient.points} pts</span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">{category.levels.proficient.description}</p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-yellow-900 dark:text-yellow-300">Developing</span>
                    <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">{category.levels.developing.points} pts</span>
                  </div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">{category.levels.developing.description}</p>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-red-900 dark:text-red-300">Beginning</span>
                    <span className="text-sm font-semibold text-red-700 dark:text-red-400">{category.levels.beginning.points} pts</span>
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-300">{category.levels.beginning.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
