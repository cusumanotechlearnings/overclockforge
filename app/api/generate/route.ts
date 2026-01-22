import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route for generating assignments
 * 
 * This endpoint takes a user query (search term) and generates:
 * 1. A nuanced case study/assignment based on the query
 * 2. A grading rubric for that assignment
 * 
 * Uses Vercel AI SDK with OpenAI to synthesize the content.
 */
export async function POST(request: NextRequest) {
  try {
    // Get the search query and assignment type from the request body
    const body = await request.json();
    const { query, assignmentType = "case-study" } = body;

    // Validate that we have a query
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a search query to generate an assignment." },
        { status: 400 }
      );
    }

    // Validate assignment type
    const validTypes = ["case-study", "multiple-choice", "essay", "test", "presentation", "project"];
    if (!validTypes.includes(assignmentType)) {
      return NextResponse.json(
        { error: `Invalid assignment type. Must be one of: ${validTypes.join(", ")}` },
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

    // Generate the assignment using AI
    // We create different prompts based on the assignment type
    let assignmentPrompt = "";
    let expectedJsonStructure = "";

    if (assignmentType === "multiple-choice") {
      assignmentPrompt = `You are an expert educational content creator. Generate a comprehensive multiple choice test based on the following topic or search query: "${query}"

Please create:

1. ASSIGNMENT TITLE: A clear, engaging title for the test

2. TEST INSTRUCTIONS: Clear instructions for students on how to complete the test, including time limits, scoring, and any special requirements.

3. ASSIGNMENT OBJECTIVES: List 3-5 specific learning objectives this test assesses.

4. MULTIPLE CHOICE QUESTIONS: Create 10-15 high-quality multiple choice questions. Each question should:
   - Test understanding, application, or analysis (not just recall)
   - Have 4 answer options (A, B, C, D)
   - Have exactly ONE correct answer
   - Include plausible distractors (wrong answers that seem reasonable)
   - Be clearly written and unambiguous

5. ANSWER KEY: Provide the correct answer for each question.

6. GRADING RUBRIC: Create a rubric for grading the test with point allocations.

Make the content academic, rigorous, and suitable for university-level coursework. Questions should require critical thinking and demonstrate understanding of the topic.

Format your response as JSON with the following structure:
{
  "title": "Test Title",
  "instructions": "Test instructions...",
  "objectives": ["Objective 1", "Objective 2", ...],
  "questions": [
    {
      "number": 1,
      "question": "Question text?",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correctAnswer": "A",
      "points": 5,
      "explanation": "Brief explanation of why this is correct"
    }
  ],
  "answerKey": {
    "1": "A",
    "2": "B",
    ...
  },
  "rubric": {
    "categories": [
      {
        "name": "Category Name",
        "points": 50,
        "levels": {
          "exemplary": { "points": 50, "description": "..." },
          "proficient": { "points": 40, "description": "..." },
          "developing": { "points": 30, "description": "..." },
          "beginning": { "points": 20, "description": "..." }
        }
      }
    ],
    "totalPoints": 100
  }
}`;
    } else if (assignmentType === "essay") {
      assignmentPrompt = `You are an expert educational content creator. Generate a comprehensive essay assignment based on the following topic or search query: "${query}"

Please create:

1. ASSIGNMENT TITLE: A clear, engaging title for the essay assignment

2. ESSAY PROMPT: A detailed, thought-provoking prompt that requires students to analyze, synthesize, and argue. Make it complex enough to require critical thinking and research.

3. ASSIGNMENT OBJECTIVES: List 3-5 specific learning objectives students should achieve.

4. ASSIGNMENT REQUIREMENTS: Provide clear requirements including:
   - Word count or page length
   - Formatting requirements
   - Citation style
   - Required sources or research components
   - Any specific elements that must be included

5. GRADING RUBRIC: Create a comprehensive rubric with the following structure:
   - Criteria categories (e.g., Thesis/Argument, Evidence/Analysis, Organization, Writing Quality, Citations)
   - Performance levels (Exemplary, Proficient, Developing, Beginning)
   - Point allocations
   - Clear descriptions for each performance level

Make the content academic, rigorous, and suitable for university-level coursework.

Format your response as JSON with the following structure:
{
  "title": "Essay Assignment Title",
  "prompt": "Essay prompt text...",
  "objectives": ["Objective 1", "Objective 2", ...],
  "requirements": ["Requirement 1", "Requirement 2", ...],
  "rubric": {
    "categories": [
      {
        "name": "Category Name",
        "points": 25,
        "levels": {
          "exemplary": { "points": 25, "description": "..." },
          "proficient": { "points": 20, "description": "..." },
          "developing": { "points": 15, "description": "..." },
          "beginning": { "points": 10, "description": "..." }
        }
      }
    ],
    "totalPoints": 100
  }
}`;
    } else if (assignmentType === "test") {
      assignmentPrompt = `You are an expert educational content creator. Generate a comprehensive test (mix of question types) based on the following topic or search query: "${query}"

Please create:

1. ASSIGNMENT TITLE: A clear, engaging title for the test

2. TEST INSTRUCTIONS: Clear instructions for students.

3. ASSIGNMENT OBJECTIVES: List 3-5 specific learning objectives this test assesses.

4. TEST QUESTIONS: Create a mix of question types:
   - 5-8 multiple choice questions (4 options each)
   - 3-5 short answer questions
   - 2-3 essay questions
   Each question should test understanding and application.

5. ANSWER KEY: Provide answers for all questions.

6. GRADING RUBRIC: Create a rubric with point allocations.

Make the content academic, rigorous, and suitable for university-level coursework.

Format your response as JSON with the following structure:
{
  "title": "Test Title",
  "instructions": "Test instructions...",
  "objectives": ["Objective 1", "Objective 2", ...],
  "questions": [
    {
      "type": "multiple-choice",
      "number": 1,
      "question": "Question text?",
      "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
      "correctAnswer": "A",
      "points": 5
    },
    {
      "type": "short-answer",
      "number": 6,
      "question": "Question text?",
      "points": 10
    },
    {
      "type": "essay",
      "number": 9,
      "question": "Question text?",
      "points": 20
    }
  ],
  "answerKey": {
    "1": "A",
    "6": "Sample answer...",
    "9": "Sample answer..."
  },
  "rubric": {
    "categories": [...],
    "totalPoints": 100
  }
}`;
    } else if (assignmentType === "presentation") {
      assignmentPrompt = `You are an expert educational content creator. Generate a comprehensive presentation assignment based on the following topic or search query: "${query}"

Please create:

1. ASSIGNMENT TITLE: A clear, engaging title for the presentation assignment

2. PRESENTATION TOPIC/PROMPT: A detailed topic or prompt that students will present on. Make it engaging and require research.

3. ASSIGNMENT OBJECTIVES: List 3-5 specific learning objectives students should achieve.

4. PRESENTATION REQUIREMENTS: Provide clear requirements including:
   - Duration (e.g., 10-15 minutes)
   - Required slides or sections
   - Visual aids requirements
   - Research requirements
   - Delivery expectations

5. GRADING RUBRIC: Create a comprehensive rubric covering content, organization, delivery, visual aids, and Q&A handling.

Format your response as JSON with the following structure:
{
  "title": "Presentation Assignment Title",
  "topic": "Presentation topic/prompt...",
  "objectives": ["Objective 1", "Objective 2", ...],
  "requirements": ["Requirement 1", "Requirement 2", ...],
  "rubric": {
    "categories": [
      {
        "name": "Category Name",
        "points": 25,
        "levels": {
          "exemplary": { "points": 25, "description": "..." },
          "proficient": { "points": 20, "description": "..." },
          "developing": { "points": 15, "description": "..." },
          "beginning": { "points": 10, "description": "..." }
        }
      }
    ],
    "totalPoints": 100
  }
}`;
    } else if (assignmentType === "project") {
      assignmentPrompt = `You are an expert educational content creator. Generate a comprehensive project assignment based on the following topic or search query: "${query}"

Please create:

1. ASSIGNMENT TITLE: A clear, engaging title for the project

2. PROJECT DESCRIPTION: A detailed description of what students will create or accomplish. Make it engaging and require application of knowledge.

3. ASSIGNMENT OBJECTIVES: List 3-5 specific learning objectives students should achieve.

4. PROJECT REQUIREMENTS: Provide clear requirements including:
   - Deliverables (what students must submit)
   - Timeline or milestones
   - Required components or sections
   - Research or data requirements
   - Format specifications

5. GRADING RUBRIC: Create a comprehensive rubric covering all project components.

Format your response as JSON with the following structure:
{
  "title": "Project Assignment Title",
  "description": "Project description...",
  "objectives": ["Objective 1", "Objective 2", ...],
  "requirements": ["Requirement 1", "Requirement 2", ...],
  "rubric": {
    "categories": [
      {
        "name": "Category Name",
        "points": 25,
        "levels": {
          "exemplary": { "points": 25, "description": "..." },
          "proficient": { "points": 20, "description": "..." },
          "developing": { "points": 15, "description": "..." },
          "beginning": { "points": 10, "description": "..." }
        }
      }
    ],
    "totalPoints": 100
  }
}`;
    } else {
      // Default: case-study
      assignmentPrompt = `You are an expert educational content creator. Generate a nuanced case study assignment based on the following topic or search query: "${query}"

Please create:

1. ASSIGNMENT TITLE: A clear, engaging title for the case study

2. CASE STUDY SCENARIO: A detailed, realistic scenario that students will analyze. Make it complex enough to require critical thinking, with multiple dimensions to consider.

3. ASSIGNMENT OBJECTIVES: List 3-5 specific learning objectives students should achieve.

4. ASSIGNMENT TASKS: Provide clear, specific tasks students must complete. These should be actionable and require analysis, synthesis, and critical thinking.

5. GRADING RUBRIC: Create a comprehensive rubric with the following structure:
   - Criteria categories (e.g., Analysis, Application, Communication)
   - Performance levels (Exemplary, Proficient, Developing, Beginning)
   - Point allocations
   - Clear descriptions for each performance level

Make the content academic, rigorous, and suitable for university-level coursework. Ensure the case study is nuanced and requires students to think critically about multiple perspectives.

Format your response as JSON with the following structure:
{
  "title": "Assignment Title",
  "scenario": "Case study scenario text...",
  "objectives": ["Objective 1", "Objective 2", ...],
  "tasks": ["Task 1", "Task 2", ...],
  "rubric": {
    "categories": [
      {
        "name": "Category Name",
        "points": 25,
        "levels": {
          "exemplary": { "points": 25, "description": "..." },
          "proficient": { "points": 20, "description": "..." },
          "developing": { "points": 15, "description": "..." },
          "beginning": { "points": 10, "description": "..." }
        }
      }
    ],
    "totalPoints": 100
  }
}`;
    }

    // Use Vercel AI SDK to generate the assignment
    const { text } = await generateText({
      model: openai("gpt-4o-mini"), // Using GPT-4o-mini for cost-effectiveness
      prompt: assignmentPrompt,
      maxTokens: 3000, // Allow enough tokens for a comprehensive assignment
    });

    // Parse the JSON response from the AI
    // The AI might wrap the JSON in markdown code blocks, so we handle that
    let jsonText = text.trim();
    
    // Remove markdown code block markers if present
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    // Parse the JSON
    let assignmentData;
    try {
      assignmentData = JSON.parse(jsonText);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        assignmentData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse assignment data from AI response");
      }
    }

    // Return the generated assignment
    return NextResponse.json({
      success: true,
      assignment: assignmentData,
      query: query, // Include the original query for reference
      assignmentType: assignmentType, // Include the assignment type
    });

  } catch (error) {
    // Handle any errors gracefully
    console.error("Error generating assignment:", error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: `Failed to generate assignment: ${error.message}. Please try again or check your API configuration.` 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while generating the assignment." },
      { status: 500 }
    );
  }
}
