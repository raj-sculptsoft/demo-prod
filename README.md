# ProdSec Frontend

A modern React-based frontend application for the ProdSec platform, built with TypeScript and Vite.

## Tech Stack

- **Framework:** React 18.3
- **Build Tool:** Vite 6.0
- **Language:** TypeScript 5.6
- **Styling:** Tailwind CSS 3.4
- **UI Components:** Radix UI
- **State Management:** Redux Toolkit
- **Form Handling:** React Hook Form with Zod validation
- **Routing:** React Router DOM 7.1
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Canvas Manipulation:** React Konva

## System Requirements

- Node.js 18.x or higher
- npm 9.x or higher
- Modern web browser (Chrome 90+, Firefox 90+, Safari 14+, Edge 90+)

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/prdsec-admin/ProdSec-Frontend.git
   cd prodsec-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with required environment variables:

   ```env
   # API Configuration
   VITE_PUBLIC_API_URL=

   # Authentication
   config.COMPANY_ID=
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code linting

## Project Structure

```
prodsec-frontend/
├── src/                          # Source files
│   ├── actions/                  # Action creators for Redux
│   ├── assets/                   # Static assets (images, fonts, etc.)
│   ├── components/               # React components
│   │   ├── core/                # Core reusable components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── layout/              # Layout components (header, footer, etc.)
│   │   ├── products/            # Product management components
│   │   ├── skeleton/            # Loading skeleton components
│   │   ├── ui/                  # UI component library
│   │   ├── upload-report/       # Report upload components
│   │   ├── vulnerabilities/     # Vulnerability management components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Library configurations and utilities
│   ├── routes/                  # Route configurations and components
│   ├── schemas/                 # Data validation schemas (Zod)
│   ├── store/                   # Redux store configuration
│   │   ├── assets/             # Asset-related state management
│   │   ├── auth/               # Authentication state management
│   │   ├── common/             # Shared state management
│   │   ├── dashboard/          # Dashboard state management
│   │   ├── products/           # Products state management
│   │   ├── upload-reports/     # Report upload state management
│   │   ├── vulnerabilities/    # Vulnerabilities state management
│   │   └── store.ts           # Root store configuration
│   ├── types/                  # TypeScript type definitions
│   ├── App.tsx                 # Root application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── public/                     # Public static files
├── dist/                      # Production build output
├── .env                       # Environment variables
├── components.json            # Component configurations
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```

### Key Directories

- **components/**: Contains all React components organized by feature and functionality

  - `core/`: Fundamental components used across the application
  - `ui/`: Reusable UI components built with Radix UI and Tailwind
  - `dashboard/`: Components specific to the dashboard feature
  - `products/`: Product management related components
  - `vulnerabilities/`: Security vulnerability management components

- **store/**: Redux store implementation using Redux Toolkit

  - Each feature has its own slice with actions and reducers
  - Organized by domain (auth, products, vulnerabilities, etc.)

- **routes/**: Application routing configuration using React Router

  - Includes route definitions and lazy-loaded components
  - Protected route implementations

- **schemas/**: Zod validation schemas for form validation and data structure

  - Type-safe runtime validation
  - Shared validation logic

- **hooks/**: Custom React hooks for reusable logic

  - State management hooks
  - Feature-specific hooks
  - Utility hooks

- **types/**: TypeScript type definitions
  - Shared interfaces
  - Type declarations
  - API response types

## Development Guidelines

- Follow the established project structure for new features
- Use TypeScript strict mode for all new code
- Follow the component naming convention: [Feature][Component]
- Implement proper error handling and loading states
- Write meaningful commit messages following conventional commits
- Ensure responsive design for all new UI components

## ESLint Configuration

The project uses a modern ESLint setup with TypeScript support. The configuration includes:

- Type-aware linting rules
- React-specific rules
- Strict type checking

## Deployment

### Build for Production

1. Update environment variables for production in `.env`:

   ```env
   VITE_API_BASE_URL=https://api.production-url.com
   ```

2. Build the application:

   ```bash
   npm run build
   ```

3. The build output will be generated in the `dist` directory

### Deployment Checklist

- [ ] Update all environment variables for production
- [ ] Ensure API endpoints are configured correctly
- [ ] Verify authentication settings
- [ ] Run build process and test the output
- [ ] Check for console errors and warnings
- [ ] Verify all assets are loading correctly

## License

Copyright 2025 ProdSec. All rights reserved.

This software and its documentation are proprietary and confidential.
Unauthorized copying, transfer, or reproduction of the contents of this software, via any medium, is strictly prohibited.

The receipt or possession of the source code and/or any parts thereof does not convey or imply any right to use them
for any purpose other than the purpose for which they were provided to you.

The software is provided "AS IS", without warranty of any kind, express or implied, including but not limited to
the warranties of merchantability, fitness for a particular purpose and non infringement. In no event shall the
authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract,
tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.

## Last Updated

2025-01-04
