# The Forge - AI Assignment Synthesizer

**The Forge** is an AI-driven assignment synthesizer that generates nuanced case studies from a knowledge base (PDFs and text files).

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **Vercel AI SDK** ✅ Integrated

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up OpenAI API key:
   - Create a file named `.env.local` in the root directory
   - Add your OpenAI API key: `OPENAI_API_KEY=your_key_here`
   - Get your API key from https://platform.openai.com/api-keys
   - **Important:** Never commit this file to version control (it's already in .gitignore)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   └── generate/       # Assignment generation API
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── AssignmentDisplay.tsx  # Assignment display component
├── knowledge_base/         # Drop your PDFs and text files here
├── lib/                   # Utility functions
└── PLAN.md                # 3-phase development roadmap
```

## Knowledge Base

Drop your PDFs and text files into the `/knowledge_base` folder. These files will be used to generate assignments (Phase 1).

## Development Roadmap

See [PLAN.md](./PLAN.md) for the complete 3-phase roadmap:

1. **Phase 1:** Knowledge Base Ingestion (Local folder + Vector indexing)
2. **Phase 2:** Synthesis Engine (Generating the assignment and rubric)
3. **Phase 3:** Grading & Multi-modal Feedback

## Current Status

✅ **Foundation Setup Complete**
- Next.js 15 project initialized
- Homepage with search bar and "Generate Assignment" button
- Knowledge base folder structure
- shadcn/ui components set up

✅ **Phase 2: Assignment Generation (COMPLETE)**
- AI-powered assignment generation using Vercel AI SDK
- Automatic rubric creation
- Beautiful assignment display with formatted output
- Copy-to-clipboard functionality
- Loading states and error handling

⏳ **Next: Phase 1 implementation** (Knowledge Base Ingestion)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
