# Story 0: Initial Project Setup

## Story

**As a** Development Team (including AI agents)
**I want** to set up the initial project structure, dependencies, and configuration
**so that** we have a clean, standardized foundation for building the CGAA game.

## Status

Complete

## Context

This is the foundational story to establish the basic development environment for the CGAA project. It involves setting up the Git repository, initializing the TypeScript project using Vite, installing necessary dependencies (Vitest, Prettier, ESLint, EasyStar.js), configuring these tools according to the architecture document, and creating the basic HTML structure. This setup ensures consistency, enables testing, and prepares the project for subsequent development sprints based on the Data-Oriented Design (SoA) architecture.

## Estimation

Story Points: 0.5 (Mostly setup and configuration)

## Acceptance Criteria

1. - [x] Git repository is initialized and potentially connected to a remote. (User confirmed)
2. - [x] TypeScript project is created using Vite (`vanilla-ts` template).
3. - [x] Base dependencies (`vitest`, `prettier`, `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-config-prettier`, `eslint-plugin-prettier`, `happy-dom`, `easystarjs`, `@types/easystarjs`) are installed via npm.
4. - [x] Vite configuration (`vite.config.ts`) is set up for TypeScript and Vitest integration (using `happy-dom`).
5. - [x] Prettier configuration (`.prettierrc.json`) is created and follows project standards (as per `architecture.md`).
6. - [x] ESLint configuration (`.eslintrc.cjs`) is created with TypeScript support and Prettier integration, enforcing project standards.
7. - [x] `tsconfig.json` is configured appropriately (e.g., strict mode).
8. - [x] `index.html` exists and contains a `<canvas id="game-canvas">` element.
9. - [x] Basic npm scripts for `dev`, `build`, `test`, `lint`, and `format` are functional.

## Subtasks

1. - [x] Initialize Git Repository
   1. - [x] Run `git init`.
   2. - [ ] (Optional) Create `.gitignore` file.
   3. - [ ] (Optional) Set up remote repository link.
2. - [x] Initialize Vite Project
   1. - [x] Run `npm create vite@latest . --template vanilla-ts` (or similar, adapting to existing directory).
   2. - [x] Run `npm install`.
3. - [x] Install Dependencies
   1. - [x] Run `npm install -D vitest prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier happy-dom`.
   2. - [x] Run `npm install easystarjs`.
   3. - [x] Run `npm install -D @types/easystarjs`.
4. - [x] Configure Tools
   1. - [x] Create/modify `.prettierrc.json` according to `architecture.md`.
   2. - [x] Create/modify `.eslintrc.cjs` according to `architecture.md`.
   3. - [x] Modify `vite.config.ts` for Vitest integration (`test: { environment: 'happy-dom' }`).
   4. - [x] Verify/adjust `tsconfig.json`.
5. - [x] Set up HTML
   1. - [x] Ensure `index.html` has `<canvas id="game-canvas"></canvas>`.
6. - [x] Define NPM Scripts
   1. - [x] Add/verify scripts in `package.json` for `dev`, `build`, `test`, `lint`, `format`.
7. - [x] Clean up Vite Boilerplate
   1. - [x] Delete `src/counter.ts`
   2. - [x] Delete `src/typescript.svg`
   3. - [x] Delete `src/style.css`
   4. - [x] Delete `public/vite.svg`
   5. - [x] Remove favicon link from `index.html`
   6. - [x] Clear content of `src/main.ts`

## Testing Requirements:\*\*

- N/A for this setup story, but subsequent stories require >= 80% unit test coverage (as per `architecture.md`).

## Story Wrap Up (To be filled in AFTER execution):\*\*

- **Agent Model Used:** Gemini 2.5 Pro (via AI pair programmer)
- **Agent Credit or Cost:** N/A
- **Date/Time Completed:** <Timestamp (pending final approval)>
- **Commit Hash:** `<Git Commit Hash of resulting code (pending user commit)>`
- **Change Log**
  - Initialized Vite project.
  - Installed required npm dependencies (dev and prod).
  - Configured Prettier, ESLint, Vite (for Vitest), and tsconfig.
  - Updated index.html with canvas and title.
  - Added standard npm scripts (test, lint, format).
  - Removed Vite boilerplate files and code.

**Current Status:** All subtasks completed. Story is pending user review and approval. Next step: User marks status as 'Complete'.
