# Performance Optimization

## Overview

Performance optimization is crucial for browser-based games like CGAA, as the platform inherently restricts available resources. The following strategies were implemented to ensure smooth gameplay.

## Critical Performance Bottlenecks

### Physics Calculations

- **Issue**: Line of sight mechanics created excessive physics calculations
- **Original Implementation**: Separate physics hitbox/area types for:
  - Enemy line of sight
  - Tower attack range
- **Solution**:
  - Reduced to one line of sight area in moving units
  - Implemented tower line of sight checks within the loop that executes when units enter the area
  - Resulted in approximately one-third reduction of line of sight areas

### Object Creation

- **Issue**: Significant framerate drops during new object creation (towers, units)
- **Cause**: JavaScript heap operations during object instantiation
- **Solution**: Implemented Object Pool pattern
  - Created all needed objects at game start
  - Kept objects in standby until needed
  - Reused the same objects repeatedly
  - Fine-tuned the initial object pool size

### Collision Detection

- **Issue**: Custom collision detection for complex shapes (chain-weapon) was performance-intensive
- **Approach**:
  - Only activated when a unit was attacking
  - Synchronized texture position with polygon shape to calculate collisions
- **Future Improvement**: Consider approximating complex shapes with multiple basic shapes (circles and rectangles)

## Algorithmic Optimizations

### Data Structures

- **Implementation**: Used arrays and sets instead of objects where possible
- **Access Optimization**: Optimized data access patterns in physics-heavy code paths

### Hot Path Optimization

- **Identified**: Critical code paths that execute frequently
- **Approach**: Focused optimization efforts on these areas
- **Techniques**:
  - Reducing object allocation
  - Minimizing method calls
  - Avoiding unnecessary calculations

## Memory Management

### Object Pooling Implementation

- **Custom Pools**: Created specialized object pools for different entity types
- **Pool Management**: Implemented methods for:
  - Obtaining objects from the pool
  - Returning objects to the pool
  - Resetting object state when recycled
- **Limitations**: Phaser's built-in object pools had interfaces incompatible with existing code

### Asset Management

- **Graphics Generation**: Procedurally generated and reused graphics
- **Texture Management**: Careful management of texture resources

## Testing and Profiling

- **Tools**: Chrome Developer Tools for performance analysis
- **Metrics**: Framerate stability across different game states
- **Critical Scenarios**:
  - During wave spawns
  - When building new towers
  - During intense combat with many units

## Results and Lessons Learned

- **Achievement**: Stable framerate in normal gameplay situations
- **Remaining Challenges**:
  - Some minor drops during peak activity
  - Further optimization of collision detection would yield additional benefits
- **Key Insights**:
  - Early performance profiling is essential
  - Object creation is particularly expensive in browser environments
  - Physics calculations need careful management
  - Object pooling is highly effective for browser games
