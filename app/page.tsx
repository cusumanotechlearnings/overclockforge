"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AssignmentDisplay } from "@/components/AssignmentDisplay";

/**
 * Assignment data structure returned from the API
 */
interface Assignment {
  title: string;
  scenario: string;
  objectives: string[];
  tasks: string[];
  rubric: {
    categories: Array<{
      name: string;
      points: number;
      levels: {
        exemplary: { points: number; description: string };
        proficient: { points: number; description: string };
        developing: { points: number; description: string };
        beginning: { points: number; description: string };
      };
    }>;
    totalPoints: number;
  };
}

export default function Home() {
  // State to store the search query
  const [searchQuery, setSearchQuery] = useState("");
  
  // State to store the selected assignment type
  const [assignmentType, setAssignmentType] = useState<string>("case-study");
  
  // State to track if we're currently generating an assignment
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State to store the generated assignment
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  
  // State to store the query used to generate the current assignment
  const [generatedQuery, setGeneratedQuery] = useState<string>("");
  
  // State to store the assignment type used for the current assignment
  const [generatedAssignmentType, setGeneratedAssignmentType] = useState<string>("case-study");
  
  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  /**
   * Function to handle the Generate Assignment button click
   * 
   * This function:
   * 1. Validates the search query
   * 2. Calls our API endpoint to generate an assignment
   * 3. Updates the UI with the result
   * 4. Handles any errors gracefully
   */
  const handleGenerateAssignment = async () => {
    // Reset previous error and assignment
    setError(null);
    setAssignment(null);

    // Validate that the user has entered a query
    if (!searchQuery.trim()) {
      setError("Please enter a search query or topic to generate an assignment.");
      return;
    }

    // Set loading state
    setIsGenerating(true);

    try {
      // Call our API endpoint to generate the assignment
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: searchQuery,
          assignmentType: assignmentType,
        }),
      });

      // Parse the response
      const data = await response.json();

      // Check if the API call was successful
      if (!response.ok) {
        // Handle API errors (like missing API key, invalid query, etc.)
        throw new Error(data.error || "Failed to generate assignment. Please try again.");
      }

      // If successful, store the assignment
      if (data.success && data.assignment) {
        setAssignment(data.assignment);
        setGeneratedQuery(data.query || searchQuery);
        setGeneratedAssignmentType(data.assignmentType || assignmentType);
        // Clear any previous errors
        setError(null);
      } else {
        throw new Error("Invalid response from server. Please try again.");
      }
    } catch (err) {
      // Handle any errors (network errors, parsing errors, etc.)
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error generating assignment:", err);
    } finally {
      // Always clear the loading state
      setIsGenerating(false);
    }
  };

  /**
   * Function to reset the view so user can generate a new assignment
   */
  const handleGenerateNew = () => {
    setAssignment(null);
    setError(null);
    setGeneratedQuery("");
    // Keep the search query so they can easily regenerate with different input
  };

  // If we have a generated assignment, show it instead of the form
  if (assignment) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-start p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-4xl pt-4 pb-8">
          <AssignmentDisplay
            assignment={assignment}
            query={generatedQuery}
            assignmentType={generatedAssignmentType}
            onGenerateNew={handleGenerateNew}
          />
        </div>
      </main>
    );
  }

  // Otherwise, show the input form
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            The Forge
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            AI-Driven Assignment Synthesizer
          </p>
        </div>

        {/* Search Bar, Assignment Type, and Generate Button */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter a topic or subject (e.g., 'ethical decision making', 'market analysis')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-12 text-base"
              disabled={isGenerating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isGenerating) {
                  handleGenerateAssignment();
                }
              }}
            />
          </div>
          
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[140px]">
              Assignment Type:
            </label>
            <Select
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.target.value)}
              className="flex-1 h-12 text-base"
              disabled={isGenerating}
            >
              <option value="case-study">Case Study</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="essay">Essay</option>
              <option value="test">Mixed Test</option>
              <option value="presentation">Presentation</option>
              <option value="project">Project</option>
            </Select>
          </div>

          <Button
            onClick={handleGenerateAssignment}
            className="w-full h-12 text-base font-semibold"
            size="lg"
            disabled={isGenerating || !searchQuery.trim()}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
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
                Generating Assignment...
              </span>
            ) : (
              "Generate Assignment"
            )}
          </Button>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-1">
              Error
            </p>
            <p className="text-sm text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-50">
            How it works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Enter a topic or subject in the search bar above, select the type of assignment you want
            (case study, multiple choice test, essay, etc.), and The Forge will generate a complete
            assignment with a detailed rubric. The AI creates nuanced content that requires
            critical thinking and analysis.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            <strong>Note:</strong> You need to set up an OpenAI API key in a <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">.env.local</code> file. 
            See the README for setup instructions.
          </p>
        </div>
      </div>
    </main>
  );
}
