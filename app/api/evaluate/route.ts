import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route for evaluating assignment submissions
 * 
 * This endpoint takes an assignment, submission, and assignment type,
 * then uses AI to evaluate the submission based on the rubric.
 */
export async function POST(request: NextRequest) {
  try {
    // Get the assignment, submission, and assignment type from the request body
    const body = await request.json();
    const { assignment, submission, assignmentType } = body;

    // Validate required fields
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment data is required." },
        { status: 400 }
      );
    }

    if (!submission) {
      return NextResponse.json(
        { error: "Submission data is required." },
        { status: 400 }
      );
    }

    if (!assignmentType) {
      return NextResponse.json(
        { error: "Assignment type is required." },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file." 
        },
        { status: 500 }
      );
    }

    // Build evaluation prompt based on assignment type
    let evaluationPrompt = "";

    if (assignmentType === "multiple-choice" && submission.type === "multiple-choice") {
      // Evaluate multiple choice answers
      const questions = assignment.questions;
      const answers = submission.answers;
      const answerKey = assignment.answerKey;

      // Calculate automatic score for multiple choice
      let correctCount = 0;
      let totalPoints = 0;
      const questionDetails = questions.map((q: any) => {
        const studentAnswer = answers[q.number];
        const correctAnswer = answerKey[q.number.toString()];
        const isCorrect = studentAnswer === correctAnswer;
        if (isCorrect) {
          correctCount++;
          totalPoints += q.points;
        }
        return {
          question: q.question,
          studentAnswer,
          correctAnswer,
          isCorrect,
          points: q.points,
          earnedPoints: isCorrect ? q.points : 0,
        };
      });

      evaluationPrompt = `You are an expert educator evaluating a multiple choice test submission.

ASSIGNMENT: ${assignment.title}

STUDENT PERFORMANCE:
- Correct Answers: ${correctCount} out of ${questions.length}
- Points Earned: ${totalPoints} out of ${questions.reduce((sum: number, q: any) => sum + q.points, 0)}
- Percentage: ${Math.round((totalPoints / questions.reduce((sum: number, q: any) => sum + q.points, 0)) * 100)}%

QUESTION-BY-QUESTION BREAKDOWN:
${questionDetails.map((q: any, i: number) => `
${i + 1}. ${q.question}
   Student Answer: ${q.studentAnswer}
   Correct Answer: ${q.correctAnswer}
   Result: ${q.isCorrect ? "✓ Correct" : "✗ Incorrect"}
   Points: ${q.earnedPoints} / ${q.points}
`).join("\n")}

RUBRIC:
${assignment.rubric.categories.map((cat: any) => `
- ${cat.name} (${cat.points} points):
  Exemplary: ${cat.levels.exemplary.description}
  Proficient: ${cat.levels.proficient.description}
  Developing: ${cat.levels.developing.description}
  Beginning: ${cat.levels.beginning.description}
`).join("\n")}

Please provide:
1. Overall feedback (2-3 sentences summarizing performance)
2. Detailed feedback analyzing strengths and areas for improvement
3. Rubric-based assessment for each category with scores and feedback

Format your response as JSON:
{
  "overallFeedback": "Overall feedback text...",
  "detailedFeedback": "Detailed analysis...",
  "rubricAssessment": [
    {
      "category": "Category Name",
      "score": 25,
      "maxScore": 25,
      "feedback": "Feedback for this category..."
    }
  ]
}`;

    } else if (assignmentType === "essay" && submission.type === "essay") {
      // Evaluate essay
      evaluationPrompt = `You are an expert educator evaluating an essay submission.

ASSIGNMENT: ${assignment.title}
ESSAY PROMPT: ${assignment.prompt}

STUDENT ESSAY:
${submission.text}

WORD COUNT: ${submission.text.trim().split(/\s+/).filter(Boolean).length} words

REQUIREMENTS:
${assignment.requirements.map((req: string, i: number) => `${i + 1}. ${req}`).join("\n")}

RUBRIC:
${assignment.rubric.categories.map((cat: any) => `
- ${cat.name} (${cat.points} points):
  Exemplary: ${cat.levels.exemplary.description}
  Proficient: ${cat.levels.proficient.description}
  Developing: ${cat.levels.developing.description}
  Beginning: ${cat.levels.beginning.description}
`).join("\n")}

Evaluate the essay based on the rubric. Consider:
- How well the essay addresses the prompt
- Quality of argumentation and analysis
- Use of evidence and examples
- Organization and structure
- Writing quality (clarity, grammar, style)
- Adherence to requirements

Provide:
1. Overall feedback (3-4 sentences)
2. Detailed feedback with specific examples from the essay
3. Rubric-based assessment with scores for each category

Format your response as JSON:
{
  "overallFeedback": "Overall feedback text...",
  "detailedFeedback": "Detailed analysis with specific examples...",
  "rubricAssessment": [
    {
      "category": "Category Name",
      "score": 20,
      "maxScore": 25,
      "feedback": "Feedback for this category with specific examples..."
    }
  ]
}`;

    } else if (assignmentType === "test" && submission.type === "test") {
      // Evaluate mixed test
      evaluationPrompt = `You are an expert educator evaluating a mixed test submission.

ASSIGNMENT: ${assignment.title}

STUDENT ANSWERS:
${assignment.questions.map((q: any) => {
  const answer = submission.answers[q.number] || "No answer provided";
  return `${q.number}. [${q.type}] ${q.question}\n   Student Answer: ${answer}\n   Points: ${q.points}`;
}).join("\n\n")}

ANSWER KEY:
${Object.entries(assignment.answerKey).map(([num, ans]) => `${num}. ${ans}`).join("\n")}

RUBRIC:
${assignment.rubric.categories.map((cat: any) => `
- ${cat.name} (${cat.points} points):
  Exemplary: ${cat.levels.exemplary.description}
  Proficient: ${cat.levels.proficient.description}
  Developing: ${cat.levels.developing.description}
  Beginning: ${cat.levels.beginning.description}
`).join("\n")}

Evaluate the submission and provide:
1. Overall feedback
2. Detailed feedback for each question type
3. Rubric-based assessment

Format your response as JSON:
{
  "overallFeedback": "Overall feedback text...",
  "detailedFeedback": "Detailed analysis...",
  "rubricAssessment": [
    {
      "category": "Category Name",
      "score": 20,
      "maxScore": 25,
      "feedback": "Feedback for this category..."
    }
  ]
}`;

    } else if (assignmentType === "case-study" && submission.type === "case-study") {
      // Evaluate case study responses
      evaluationPrompt = `You are an expert educator evaluating a case study submission.

ASSIGNMENT: ${assignment.title}
CASE STUDY SCENARIO: ${assignment.scenario}

STUDENT RESPONSES:
${assignment.tasks.map((task: string, i: number) => {
  const response = submission.responses[i + 1] || "No response provided";
  return `Task ${i + 1}: ${task}\nResponse: ${response}`;
}).join("\n\n")}

RUBRIC:
${assignment.rubric.categories.map((cat: any) => `
- ${cat.name} (${cat.points} points):
  Exemplary: ${cat.levels.exemplary.description}
  Proficient: ${cat.levels.proficient.description}
  Developing: ${cat.levels.developing.description}
  Beginning: ${cat.levels.beginning.description}
`).join("\n")}

Evaluate the responses based on:
- Depth of analysis
- Application of concepts
- Critical thinking
- Quality of reasoning
- Completeness of responses

Provide:
1. Overall feedback
2. Detailed feedback for each task
3. Rubric-based assessment

Format your response as JSON:
{
  "overallFeedback": "Overall feedback text...",
  "detailedFeedback": "Detailed analysis...",
  "rubricAssessment": [
    {
      "category": "Category Name",
      "score": 20,
      "maxScore": 25,
      "feedback": "Feedback for this category..."
    }
  ]
}`;

    } else {
      // Generic evaluation for presentations/projects
      evaluationPrompt = `You are an expert educator evaluating a ${assignmentType} submission.

ASSIGNMENT: ${assignment.title}

STUDENT SUBMISSION:
${submission.text}

RUBRIC:
${assignment.rubric.categories.map((cat: any) => `
- ${cat.name} (${cat.points} points):
  Exemplary: ${cat.levels.exemplary.description}
  Proficient: ${cat.levels.proficient.description}
  Developing: ${cat.levels.developing.description}
  Beginning: ${cat.levels.beginning.description}
`).join("\n")}

Evaluate the submission and provide:
1. Overall feedback
2. Detailed feedback
3. Rubric-based assessment

Format your response as JSON:
{
  "overallFeedback": "Overall feedback text...",
  "detailedFeedback": "Detailed analysis...",
  "rubricAssessment": [
    {
      "category": "Category Name",
      "score": 20,
      "maxScore": 25,
      "feedback": "Feedback for this category..."
    }
  ]
}`;
    }

    // Use Vercel AI SDK to generate the evaluation
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: evaluationPrompt,
      maxTokens: 2000,
    });

    // Parse the JSON response
    let jsonText = text.trim();
    
    // Remove markdown code block markers if present
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    // Parse the JSON
    let evaluationData;
    try {
      evaluationData = JSON.parse(jsonText);
    } catch (parseError) {
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse evaluation data from AI response");
      }
    }

    // Calculate total score from rubric assessment
    const totalScore = evaluationData.rubricAssessment.reduce(
      (sum: number, item: any) => sum + (item.score || 0),
      0
    );
    const maxScore = assignment.rubric.totalPoints;
    const percentage = Math.round((totalScore / maxScore) * 100);

    // Return the evaluation results
    return NextResponse.json({
      success: true,
      results: {
        totalScore,
        maxScore,
        percentage,
        feedback: evaluationData.overallFeedback || "Evaluation complete.",
        detailedFeedback: evaluationData.detailedFeedback,
        rubricScores: evaluationData.rubricAssessment || [],
      },
    });

  } catch (error) {
    console.error("Error evaluating submission:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: `Failed to evaluate submission: ${error.message}. Please try again.` 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while evaluating the submission." },
      { status: 500 }
    );
  }
}
