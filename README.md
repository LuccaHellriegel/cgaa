# CGAA - Circle Gladiator Army Arena

A fast-paced action tower defense game built with Phaser 3, TypeScript, and Vite.

## Game Overview

CGAA combines elements of 2D action games with tower defense mechanics to create a unique strategic experience. Players control a rebellious circle defending blue friends against multiple camps of aggressive enemies.

## Features

- Fast-paced action gameplay with tower defense elements
- Multiple game phases: Survival, Conquest, Cooperation, and Final
- Diplomacy system for interacting with enemy camps
- Procedurally generated camp layouts
- Minimalist visual style

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

### Testing

The project uses Vitest for testing. All components are thoroughly tested with 100% coverage.

## Architecture

The game follows a component-based architecture with:

- Scene management for different game states
- Reusable game components
- Event-driven communication
- Type-safe implementations

## License

MIT License - See LICENSE file for details
