# CGAA - Implementation TODOs

This document provides a consolidated list of TODOs that need to be implemented to complete the game based on the SPECS.md requirements. The TODOs are organized by system and component.

## Core Systems

### Wave System

- Connect wave direction control with the actual wave spawning system
- Implement wave spawning based on camp state
- Implement proper audio trigger for wave start events
- Add wave completion rewards and feedback for player
- Connect enemy pooling with the wave component for better performance
- Add visual indicators for wave paths

### Diplomacy System

- Implement the `findNearbyCamps` method in DiplomatMenu
- Connect wave direction UI with the actual wave targeting system
- Add effects/animation when camp changes to cooperating state
- Connect camp setWaveTarget method with the wave spawning system
- Store camps list in registry for access in KingChamber scene

### Combat System

- Add damage feedback effects and sounds for enemies
- Implement enemy attack behaviors and animations
- Add different enemy types with unique visuals and behaviors
- Implement pathfinding for enemies to navigate around obstacles
- Create a target priority system for enemies

### King Boss Battle

- Implement king visual effects and animations
- Add sound effects for king's actions
- Create multiple attack patterns for king
- Add battle phases based on king's health
- Implement visual and audio feedback for special attacks
- Develop proper victory sequence with animations and effects
- Add environmental hazards and terrain features in king chamber
- Add dramatic sequence when barrier opens
- Implement full victory screen with stats and achievements

## Technical Enhancements

### Performance Optimization

- Integrate object pools with game components (enemies, projectiles, particles)
- Implement proper object reuse with state reset
- Create texture atlas generation for dynamic content
- Add detailed performance monitoring

### Audio System

- Connect sound triggers with game events
- Add error handling for missing audio files
- Implement transitions between game states
- Create dynamic music system based on gameplay intensity
- Add dramatic music and effects for key moments

### UI and Player Experience

- Implement menu position updates to follow game camera
- Add tutorial and onboarding elements
- Implement dynamic difficulty scaling during king fight
- Create unique visuals for different camp sizes and types
- Add proper player transition to king chamber
- Implement save game state to enable game continuation
- Add option to restart or continue playing after victory

## Implementation Priorities

1. **High Priority**

   - Complete wave system integration with camps
   - Implement the findNearbyCamps method
   - Connect wave targeting with actual spawning
   - Integrate object pools with enemies

2. **Medium Priority**

   - Add different enemy types and behaviors
   - Implement king battle phases and attack patterns
   - Connect audio system with game events
   - Implement pathfinding for enemies

3. **Lower Priority**
   - Add tutorials and help system
   - Implement victory screen with stats
   - Create dynamic music system
   - Add detailed performance monitoring

## Testing Requirements

- Verify camp destruction properly triggers barrier condition
- Test wave direction works correctly between cooperating camps
- Ensure object pools properly recycle objects
- Verify king battle progresses through phases correctly
- Test transitions between game states maintain player progress
