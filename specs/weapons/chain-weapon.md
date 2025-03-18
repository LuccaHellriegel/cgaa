# Chain Weapon

## Overview

This document provides guidance for implementing the chain weapon, which consists of a series of circles with a triangle head - a primary weapon in Circle Gladiator Army Arena.

## Design Considerations

- **Visual Consistency**: Maintain consistent sizing ratio between chain links, head, and handle
- **Animation Smoothness**: Balance performance with visual appeal for smooth chain movement
- **Collision Handling**: Only the triangle head should trigger collision events
- **Physics Integration**: Use lightweight physics for chain movement without full rigid body simulation
- **Texture Integration**: Use circle and triangle textures from the [Texture Generation](../prog-gen/texture-generation.md) system

## Phaser Implementation Recommendations

### Component Structure

- Use Phaser's Container for the entire weapon
- Implement chain links using Phaser's Group with pool recycling for performance
- Leverage Phaser's depth sorting to ensure proper visual layering

### Animation Approaches

Chain extension is best implemented using Phaser's Timeline feature:

```typescript
// Recommended extension animation approach
extendChain(target: Phaser.Math.Vector2): void {
  // Calculate key positions for the animation path
  const points = this.calculateBezierPath(
    this.position,
    target,
    // Control point for curve effect
    new Phaser.Math.Vector2(this.x + 50, this.y - 30)
  );

  // Create timeline for sequential animation
  const timeline = this.scene.tweens.createTimeline();

  // Setup each link to follow the path with staggered timing
  this.links.forEach((link, index) => {
    timeline.add({
      targets: link,
      x: points[index].x,
      y: points[index].y,
      ease: 'Power2',
      offset: index * 50 // Staggered timing
    });
  });

  timeline.play();
}
```

## Performance Tips

- **DO** use Phaser's built-in `Curves.Spline` for calculating natural chain paths
- **DO** pre-generate all required circle and triangle textures at load time
- **DON'T** create new sprites for each chain link during gameplay
- **DON'T** apply physics bodies to each chain link (use them only for the head)

## Common Implementation Challenges

### Challenge: Chain Movement Appears Robotic

**Solution**: Use Phaser's easing functions to create natural movement:

```typescript
// Adding natural movement with easing
this.scene.tweens.add({
  targets: this.head,
  x: targetX,
  y: targetY,
  ease: "Elastic.Out", // Natural "whip" effect
  duration: 400,
});
```

### Challenge: Performance Issues with Long Chains

**Solution**: Implement LOD (Level of Detail) for distant chains:

```typescript
// Distance-based detail scaling
private updateChainDetail(): void {
  const distance = Phaser.Math.Distance.Between(
    this.scene.cameras.main.centerX,
    this.scene.cameras.main.centerY,
    this.x,
    this.y
  );

  // Reduce detail for distant chains
  if (distance > 500) {
    this.setLinkInterval(2); // Show every other link
  } else {
    this.setLinkInterval(1); // Show all links
  }
}
```
