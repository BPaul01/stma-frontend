# STMA Frontend (Simple Task Management App)

A modern, React-based task management and note-taking application built with React 19, TypeScript, and Vite 8.

## Project Overview

STMA is designed to be a seamless fusion of task management and note-taking, featuring Markdown-powered tasks and a distraction-free writing experience.

### Tech Stack
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI (Radix UI)
- **Routing:** React Router Dom v7 (HashRouter)

## Directory Structure

- `src/`: Main React application source code.
  - `pages/`: Application page components (e.g., `DashboardPage.tsx`).
- `@/`: (Literal directory) Currently contains Shadcn UI components and utility functions. 
  - **Note:** Path alias `@/*` is configured in `tsconfig.json` and `vite.config.ts` to point to `src/*`. The existence of a literal `@/` directory is an anomaly that may need resolution (e.g., moving contents to `src/`).
- `public/home/`: Contains the static landing page (`index.html`).
- `components.json`: Shadcn UI configuration.

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Deployment
The project is configured for deployment to GitHub Pages.
```bash
npm run deploy
```

## Development Conventions

- **Styling:** Use Tailwind CSS 4 utility classes. Tailwind is integrated via the `@tailwindcss/vite` plugin.
- **Components:** Use Shadcn UI for base components. New UI components should be added to the UI library via the shadcn CLI or placed in the components directory.
- **Routing:** The application currently uses `HashRouter`. The root path `/` is configured to redirect to the static landing page at `/home/index.html`.
- **Aliases:** Use the `@/` prefix for imports from the `src` directory (as per `tsconfig` configuration).

## Current State & TODOs
- [ ] Implement the Dashboard in `src/pages/DashboardPage.tsx`.
- [ ] Transition from the static landing page to a fully integrated React landing page.
