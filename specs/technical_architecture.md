# Technical Architecture

## Technology Stack

- **Framework**: Phaser 3 (JavaScript/TypeScript game framework)
- **Language**: TypeScript
- **Runtime Environment**: Web browser
- **Physics Engine**: Phaser's Arcade Physics (with custom extensions)
- **Build Tool**: Vite
- **Type Checking**: TypeScript compiler with strict mode
- **Testing Framework**: Vitest

## Code Architecture

### Component-Based Architecture

- **Base Component**: Abstract `BaseComponent` class implementing core functionality
  - Event management system with add/remove/emit methods
  - Assertion-based validation
  - Lifecycle management (creation, update, destruction)
- **Component Configuration**: Standardized configuration interfaces
- **Component Types**:
  - Game entities: Player, Enemy, Tower, Soul
  - UI elements: TowerMenu, PlayerStatusUI, GameStatusUI
  - World objects: CampBuilding
- **Component Composition**: Entities can be composed of multiple components
- **Component Communication**: Event-driven communication between components

### Utility Layer

- **Assertion Utilities**: Centralized assertion function for runtime validation
  - Context-rich error messages
  - Type assertion capabilities
  - Used throughout the codebase for error prevention

### Scene Management

- **Implementation**: Phaser scene system
- **Organization**: Separate scenes for different game states
- **Scene Communication**: Event-based communication between scenes

## Game Systems

### AI System

#### Current AI: Action List System

- **Approach**: Array of planned actions for each unit
- **Processing**: Sequential execution of actions
- **Interruption Handling**:
  - New action created to handle interruption
  - Linked to interrupted action
  - Original action resumes after interruption handler completes

### Physics and Collision

- **Base System**: Phaser's Arcade Physics
- **Shapes**: Circles and rectangles
- **Optimization**: Custom collision strategies for performance
- **Detection**: Polygon shapes for complex collisions (e.g., chain-weapon)
- **Activation**: Conditional collision detection based on game state

## Performance Optimization

### Object Pooling

- **Implementation**: Pre-allocation and reuse of game objects
- **Target Objects**:
  - Projectiles
  - Effects
  - Temporary entities
- **Pool Management**: Centralized object pool for reusable game entities
- **Benefits**: Reduced garbage collection, stable framerate

### Rendering Optimization

- **Texture Generation**: Programmatic generation of textures
- **Animation Management**: Dynamic creation and management of animation frames
- **Visibility Culling**: Only rendering objects in view
- **Asset Loading**: Asynchronous asset handling

### Memory Management

- **Resource Cleanup**: Explicit destruction of components when no longer needed
- **Event Listener Cleanup**: Automatic removal of event listeners on component destruction
- **Reference Management**: Careful handling of object references to prevent memory leaks

## Development Practices

### Type Safety

- **Static Typing**: Comprehensive type declarations for all components
- **Interface Definitions**: Clear interfaces for component configurations
- **Type Assertions**: Runtime type validation through assertions
- **Type Checking**: Regular verification with `npm run typecheck`

### Code Organization

- **Directory Structure**:
  - `/src/components`: Game entity components
  - `/src/scenes`: Game scenes
  - `/src/utils`: Utility functions
  - `/src/managers`: System managers
  - `/src/types`: TypeScript type definitions
  - `/src/events`: Event definitions and handlers
  - `/src/controllers`: Game controllers
  - `/src/graphics`: Graphics utilities

### Modular Development

- **Small Files and Functions**: Keep files under 300 lines, functions under 70 lines
- **Single Responsibility**: Each component has a single clear purpose
- **Reusable Code**: Utilities and common functionality extracted to shared locations
- **Clear API Boundaries**: Well-defined interfaces between components

## Future Architecture Considerations

### Audio Management

- **Dynamic Audio Loading**: Load audio assets as needed
- **Audio Pooling**: Reuse audio instances for performance
- **Volume Management**: Global and per-category volume control
- **Spatial Audio**: Position-based audio for immersion

### Testing Infrastructure

- **Unit Testing**: Component-level tests with Vitest
- **Integration Testing**: Testing component interactions
- **Automated Testing**: CI/CD pipeline integration

### Logging System

- **Structured Logging**: Consistent log format with context
- **Log Levels**: Different verbosity levels based on environment
- **Performance Monitoring**: Track key performance metrics
