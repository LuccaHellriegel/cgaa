# Weapon Animation System

## Overview

This document provides guidance for implementing weapon animations in Circle Gladiator Army Arena, with a focus on Phaser's animation capabilities and best practices.

## Design Principles

- **Event-Driven Architecture**: Trigger animations through Phaser's event system
- **Timeline-Based Sequencing**: Use Phaser's timeline feature for complex multi-part animations
- **Performance-First Approach**: Minimize performance impact of complex animations
- **Component Reusability**: Design animations to work across multiple weapon types

## Phaser Animation Recommendations

### Using Phaser's Timeline System

Phaser provides a powerful timeline system that's ideal for weapon animations:

```typescript
// Creating sequential animations with Phaser timelines
function createChainExtensionAnimation(
  scene: Phaser.Scene,
  weapon: ChainWeapon,
  target: Phaser.Math.Vector2
): void {
  // Calculate direction vector
  const angle = Phaser.Math.Angle.Between(
    weapon.x,
    weapon.y,
    target.x,
    target.y
  );

  // Create timeline for precise sequencing
  const timeline = scene.tweens.createTimeline();

  // Add preparation animation
  timeline.add({
    targets: weapon.handle,
    scaleX: 1.2,
    scaleY: 1.2,
    duration: 80,
    yoyo: true,
    ease: "Sine.easeInOut",
  });

  // Add sequential link animations
  weapon.links.forEach((link, index) => {
    timeline.add({
      targets: link,
      x: link.x + Math.cos(angle) * (index + 1) * 15,
      y: link.y + Math.sin(angle) * (index + 1) * 15,
      alpha: { from: 0, to: 1 },
      offset: 80 + index * 30, // Staggered timing
    });
  });

  // Play the complete sequence
  timeline.play();
}
```

### Phaser Event Integration

```typescript
// Hook animations into Phaser's event system
scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
  if (weapon.canAttack()) {
    createChainExtensionAnimation(scene, weapon, pointer);
  }
});
```

## Performance Best Practices

- **DO** use Phaser's built-in cache for storing animation data
- **DO** leverage Phaser's WebGL renderer for hardware acceleration
- **DON'T** update sprites that aren't visible on screen
- **DON'T** create animations for every weapon instance - share definitions

## Common Animation Challenges

### Challenge: Smooth Chain Movement

**Solution**: Use Phaser's built-in path following and curve system:

```typescript
// Creating a natural path for chain extensions
function createChainPath(
  start: Phaser.Math.Vector2,
  end: Phaser.Math.Vector2
): Phaser.Curves.Path {
  const path = new Phaser.Curves.Path(start.x, start.y);

  // Calculate control point for natural arc
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2 - 30; // Offset for arc

  // Create a curved path
  path.quadraticBezierTo(midX, midY, end.x, end.y);

  return path;
}
```

### Challenge: Animation Cleanup

**Solution**: Use Phaser's event system for proper cleanup:

```typescript
// Ensure proper animation cleanup
timeline.once("complete", () => {
  // Clean up any temporary objects
  scene.tweens.killTweensOf(weapon.links);

  // Reset to idle state
  weapon.setActiveAnimation("idle");
});
```

## Integration with Weapon Systems

- Use Phaser's state machine pattern to manage weapon animation states
- Integrate weapon animations with Phaser's physics for realistic impact effects
- Leverage Phaser's particle system for enhanced visual effects during animations
