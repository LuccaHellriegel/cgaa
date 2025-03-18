# Weapon System

## Overview

This document outlines the weapon system approach for Circle Gladiator Army Arena, focusing on weapons composed of basic shapes (circles and triangles).

## Design Principles

- **Composition Over Inheritance**: Weapons should be composed of reusable shape components
- **Phaser Container Integration**: Leverage Phaser's Container system for hierarchical weapon structures
- **Event-Driven Animations**: Use Phaser's event system to trigger animations at appropriate times
- **Memory Optimization**: Reuse textures and minimize redundant game objects

## Implementation Advice

### Weapon Structure

- Use `Phaser.GameObjects.Container` as the base for all weapons
  - This allows for easy grouping, positioning, and transformation of all weapon parts
  - Proper parent-child relationships simplify animation logic
- Prefer Phaser's built-in object pooling over manual creation/destruction

  - Phaser's `Group` class has built-in pooling functionality that improves performance

- Implement a consistent interface across weapon types
  - This simplifies integration with player control systems and enemy AI

### Phaser Integration Best Practices

```typescript
// Create a weapon using Phaser's GameObject composition
class ChainWeapon extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, config: WeaponConfig) {
    super(scene, x, y);

    // Add weapon components to the container
    this.head = scene.add.sprite(0, 0, config.headTexture);
    this.add(this.head);

    // Set up Phaser's built-in event system for animations
    scene.events.on("update", this.updateWeapon, this);
  }

  // Clean up when weapon is destroyed
  destroy(fromScene?: boolean): void {
    this.scene.events.off("update", this.updateWeapon, this);
    super.destroy(fromScene);
  }
}
```

## Performance Considerations

- **DO**: Use Phaser's scene update event instead of custom update loops
- **DON'T**: Create/destroy weapon sprites frequently - reuse through object pooling
- **DO**: Take advantage of Phaser's Container transformations for positioning weapon parts
- **DON'T**: Use raw Canvas/WebGL operations when Phaser equivalents exist

## Common Pitfalls

- Not properly cleaning up event listeners when weapons are destroyed
- Creating too many individual sprites for a single weapon
- Implementing custom physics instead of using Phaser's built-in systems
