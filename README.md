# Neural Architecture Energy Footprint Analyzer

## Overview

This is a comprehensive web application for analyzing and visualizing the energy consumption and carbon footprint of AI neural network models. The platform enables users to upload datasets containing AI model metrics, perform statistical analysis, and receive actionable recommendations for optimizing model efficiency and reducing environmental impact. The application focuses on sustainable AI development by providing data-driven insights into the relationship between model accuracy, computational requirements (FLOPs), and energy consumption.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: Shadcn UI (New York style variant) built on Radix UI primitives, providing accessible and composable components with Tailwind CSS for styling.

**Design System**: Material Design (Data-Focused Variant) optimized for data visualization and professional dashboards. The theme supports both dark mode (default) and light mode with sustainability-focused green accent colors.

**State Management**: TanStack Query (React Query) for server state management, caching, and data synchronization. No global client state management library is used; component-level state is managed with React hooks.

**Routing**: Wouter for lightweight client-side routing with five main pages: Dashboard, Upload, Visualizations, Recommendations, and Reports.

**Data Visualization**: Chart.js with react-chartjs-2 wrapper for creating interactive charts including scatter plots, histograms, pie charts, box plots, and bar charts.

**Real-time Communication**: Socket.IO client for receiving live analysis progress updates and completion notifications during dataset processing.

**Form Handling**: React Hook Form with Zod schema validation via @hookform/resolvers for type-safe form inputs.

### Backend Architecture

**Runtime**: Node.js with Express.js framework for the REST API server.

**TypeScript Configuration**: Full-stack TypeScript with ESM modules, strict type checking enabled throughout the codebase.

**API Structure**: RESTful endpoints for dataset upload, model retrieval, statistics, chart data, and recommendations. File uploads handled via Multer middleware with in-memory storage.

**Real-time Features**: Socket.IO server for broadcasting analysis progress events to connected clients during CSV processing and statistical computations.

**Development Server**: Custom Vite integration in development mode with HMR (Hot Module Replacement), while production serves pre-built static assets.

**Data Processing**: CSV parsing and enrichment pipeline that:
- Validates uploaded CSV files for required columns (model_name, model_type, accuracy, energy_kwh, flops_giga)
- Calculates derived metrics including efficiency scores and carbon footprint estimates
- Generates statistical summaries (mean, median, mode, standard deviation, min/max ranges)
- Creates chart-ready data structures for frontend visualization

### Data Storage

**ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations.

**Database Provider**: Neon serverless PostgreSQL (configured via @neondatabase/serverless adapter).

**Schema Design**: Four primary tables:
- `users`: User authentication (username/password)
- `datasets`: Uploaded CSV file metadata with processing status tracking
- `ai_models`: Individual model records with metrics (accuracy, energy, FLOPs, parameters, efficiency scores, carbon footprint)
- `analysis_results`: Aggregated statistics per dataset (mean energy, median parameters, mode model type, accuracy/FLOPs ranges, efficiency averages, total carbon footprint)

**Fallback Storage**: In-memory storage implementation (MemStorage class) for development/testing without requiring database provisioning. Implements the same IStorage interface as the database layer.

**Migration Strategy**: Drizzle Kit for schema migrations with push-based deployments.

### External Dependencies

**Database**: 
- Neon Serverless PostgreSQL for production data persistence
- Connection string provided via `DATABASE_URL` environment variable
- Drizzle ORM manages schema and queries

**Design System**:
- Google Fonts: Inter (400-800 weights) for UI text, JetBrains Mono (400-600) for monospace content
- Shadcn UI component library with Radix UI primitives
- Tailwind CSS for utility-first styling

**Development Tools**:
- Replit-specific plugins for development mode (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner)

**Third-party Libraries**:
- Socket.IO for WebSocket-based real-time communication
- Chart.js for data visualization
- React Dropzone for drag-and-drop file uploads
- jsPDF and html2canvas for PDF report generation
- date-fns for date formatting and manipulation
- PapaParse for CSV parsing (type definitions included)
- Zod for runtime schema validation

**Build & Deployment**:
- Vite for frontend bundling with React plugin
- esbuild for backend bundling (server code compiled to dist/)
- PostCSS with Tailwind CSS and Autoprefixer for CSS processing