# Kindi Prototype

A multi-panel intelligence analysis dashboard with interactive visualizations for exploring complex datasets.

## Project Overview

Kindi Prototype is an intelligence analysis tool that provides a three-panel dashboard with synchronized visualizations:
- Network Graph: Visualize entities and their relationships
- Timeline: Explore events chronologically
- Map: View geospatial data and movements

The dashboard includes powerful features for data exploration, filtering, and analysis.

## Technology Stack

- **Framework**: Next.js 15.5.0 with React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Visualization Libraries**:
  - Network Graph: react-force-graph
  - Timeline: vis-timeline
  - Map: react-leaflet
- **Testing**: Jest, React Testing Library

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd kindi-prototype
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
```bash
npm run dev
   ```

4. **Open in browser**:
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Workflow

### Available Scripts

- **Development**: `npm run dev` - Start the development server
- **Build**: `npm run build` - Create a production build
- **Start**: `npm run start` - Run the production build
- **Lint**: `npm run lint` - Run ESLint to check for issues
- **Lint Fix**: `npm run lint:fix` - Fix ESLint issues automatically
- **Format**: `npm run format` - Format code with Prettier

### Project Structure

```
kindi-prototype/
├── app/                     # Next.js app directory
│   ├── api/                 # API routes (for future backend integration)
│   ├── components/          # Shared React components
│   │   ├── core/            # Core UI components
│   │   ├── layout/          # Layout components
│   │   └── visualizations/  # Visualization-specific components
│   ├── contexts/            # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and services
│   │   ├── data/            # Data transformation and indexing
│   │   ├── search/          # Search functionality
│   │   └── sync/            # Synchronization between visualizations
│   ├── models/              # TypeScript interfaces and type definitions
│   ├── page.tsx             # Main application page
│   └── layout.tsx           # Root layout
├── data/                    # Static JSON data files
│   ├── datasets/            # Sample datasets
│   └── schema/              # JSON schema definitions
├── public/                  # Static assets
├── tests/                   # Test files
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── e2e/                 # End-to-end tests
└── utils/                   # Shared utility functions
```

## Key Features

- Three-panel dashboard with synchronized visualizations
- Interactive network graph for entity relationship analysis
- Timeline for chronological event exploration
- Map for geospatial analysis
- Responsive design for various screen sizes
- Advanced filtering and search capabilities
- Data transformation and export features

## Contributing

Please follow the established code style and conventions when contributing to this project. Make sure to run linting and tests before submitting pull requests.