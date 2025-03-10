# Technical Architecture

## Technology Stack

- **Framework**: Phaser 3 (JavaScript/TypeScript game framework)
- **Language**: TypeScript (converted from JavaScript during development)
- **Runtime Environment**: Web browser
- **Physics Engine**: Phaser's Arcade Physics (with custom extensions)

## Code Architecture Evolution

### Initial Architecture

- **Approach**: Functional JavaScript
- **Design Pattern**: Function composition for game map generation
  ```
  f() = Calculate middle points of Camps
  g() = Calculate wall positions of Camps
  h() = Calculate randomized building positions
  ```
- **Data Flow**: Passing large map objects between functions

### Current Architecture

- **Approach**: Object-Oriented TypeScript
- **Pattern**: Game objects with state and behavior
- **Components**: Objects representing game entities with fields and methods
- **Rationale**: Better aligns with the mental model of a real-time game with interacting units and dynamic state

### Hybrid Approach

- **Functional Elements**: Retained for static computation (e.g., texture generation, animation frame creation)
- **Object-Oriented Elements**: Used for dynamic game elements and state management

## Scene Management

- **Implementation**: Phaser scene system
- **Organization**: Separate scenes for different game states

## AI System

### Initial AI: Finite State Machine

- **Approach**: Informal FSM with states and transitions
- **Issues**: Side effects between states led to bugs (e.g., units running into walls)
- **Complexity**: Bug fixes became too complex for the use case

### Current AI: Action List System

- **Approach**: Array of planned actions for each unit
- **Processing**: Sequential execution of actions
- **Interruption Handling**:
  - New action created to handle interruption
  - Linked to interrupted action
  - Original action resumes after interruption handler completes
- **Inspiration**: Naughty Dog's list-based action system

## Physics and Collision

### Basic Physics

- **System**: Phaser's Arcade Physics
- **Shapes**: Circles and rectangles
- **Limitations**: Only supports basic shapes

### Extended Collision

- **System**: Custom collision detection for complex shapes
- **Implementation**: Polygon shapes for the chain-weapon
- **Activation**: Only during attack animations
- **Method**: Synchronizing texture position with polygon shape for collision calculation

## Performance Optimization

### Line of Sight Optimization

- **Problem**: Performance bottleneck with multiple line-of-sight areas
- **Solution**:
  - Use one line of sight area in moving units
  - Implement tower line of sight in the unit entry loop
  - Reduced line of sight areas by one-third

### Object Pool Implementation

- **Problem**: Framerate drops during object creation
- **Solution**: Create all needed objects at game start and reuse them
- **Implementation**: Custom object pools for game entities
- **Result**: Stable framerate in all game states

## Map Generation

- **Approach**: Procedural generation
- **Components**:
  - Camp positions
  - Wall layouts
  - Building placements
  - Guardian positions
- **Implementation**: Object-based system holding generation state

## Resource Management

- **Textures**: Programmatically generated and stored
- **Animation Frames**: Created and added to textures
- **Object Pooling**: Pre-allocation and reuse of game objects
