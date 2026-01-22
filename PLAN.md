# The Forge - Development Plan

## Overview
**The Forge** is an AI-driven assignment synthesizer that generates nuanced case studies from a knowledge base (PDFs and text files). This document outlines the 3-phase roadmap for building the application.

---

## Phase 1: Knowledge Base Ingestion
**Goal:** Enable users to upload and reference knowledge base materials (PDFs/Text) for case study generation.

### Components:
- **Local Folder System:** Set up `/knowledge_base` folder where users can drop PDFs and text files
- **File Upload Interface:** Build UI for uploading files to the knowledge base
- **Vector Indexing:** Implement vector database integration (e.g., Pinecone, Chroma, or local embeddings) to make the knowledge base searchable
- **Document Processing:** Parse PDFs and text files, extract content, and convert to embeddings
- **Search Functionality:** Enable semantic search across the knowledge base

### Technical Stack:
- PDF parsing libraries (pdf-parse or similar)
- Text processing utilities
- Vector database/embeddings (OpenAI embeddings or similar)
- File system operations for local storage

---

## Phase 2: Synthesis Engine
**Goal:** Generate assignments and rubrics based on the knowledge base content.

### Components:
- **Assignment Generator:** AI-powered system that creates nuanced case studies from knowledge base content
- **Rubric Generator:** Automatically generate grading rubrics for generated assignments
- **Prompt Engineering:** Design effective prompts for the Vercel AI SDK to synthesize content
- **Customization Options:** Allow users to specify assignment parameters (difficulty, length, topics, etc.)
- **Preview & Edit:** Interface to preview generated assignments before finalizing

### Technical Stack:
- Vercel AI SDK for AI interactions
- Prompt templates for consistent generation
- State management for assignment generation workflow

---

## Phase 3: Grading & Multi-modal Feedback
**Goal:** Provide AI-powered grading and multi-modal feedback for student submissions.

### Components:
- **Submission Interface:** Allow students to submit assignments
- **AI Grader:** Automatically grade submissions based on rubrics
- **Multi-modal Feedback:** Generate feedback in various formats (text, audio, video, or visual annotations)
- **Score Tracking:** Track and store grades
- **Feedback Export:** Export feedback in different formats for students

### Technical Stack:
- AI grading models
- Multi-modal AI capabilities (text-to-speech, etc.)
- Database for storing submissions and grades
- File handling for various submission formats

---

## Current Phase: Phase 2 - Synthesis Engine ✅

### ✅ Completed:
- ✅ Foundation Setup
  - Next.js 15 project initialization with TypeScript
  - Basic homepage with search bar and "Generate Assignment" button
  - Knowledge base folder structure
  
- ✅ Phase 2: Assignment Generation (COMPLETE)
  - AI-powered assignment generation API using Vercel AI SDK
  - Automatic case study scenario generation
  - Automatic rubric creation with multiple criteria
  - Beautiful assignment display component
  - Loading states and error handling
  - Copy-to-clipboard functionality
  - User-friendly error messages

### ⏳ Next: Phase 1 implementation (Knowledge Base Ingestion)

---

## Next Steps:
1. ✅ ~~Complete foundation setup~~ (Done)
2. ✅ ~~Build assignment generation interface~~ (Done)
3. Begin Phase 1: Set up file upload and document processing
4. Integrate vector indexing for knowledge base search
5. Connect knowledge base search to assignment generation
