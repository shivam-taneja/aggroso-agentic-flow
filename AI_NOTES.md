# AI Usage & Architecture Notes

## How AI Was Used
I utilized AI (ChatGPT & Gemini) primarily as a productivity accelerator rather than for core logic generation. My approach was to define the architecture first, then use AI to scaffold the code.

**1. Scaffolding & Boilerplate:**
- Generating the initial NestJS module structure (Controllers, Services, DTOs).
- Creating standard Tailwind CSS layouts and Shadcn UI component configurations.
- Writing the regex patterns for CORS validation in `main.ts`.

**2. What I Built Manually:**
- **The Workflow Logic:** The core processor (`workflow.processor.ts`) that chains steps together. I manually designed the logic to pass the `output` of Step N into the `context` of Step N+1 to ensure a coherent chain of thought.
- **State Management:** Deciding to save the workflow state to the database *after every step* (not just at the end) to enable the real-time polling feature on the frontend.
- **Prompt Engineering:** Crafting the system instructions for Gemini to ensure it returns raw text without conversational filler.