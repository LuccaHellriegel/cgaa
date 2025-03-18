# Programmatic Texture Generation

## Overview

This document outlines how we'll generate textures for basic shapes (circles and triangles) in Circle Gladiator Army Arena. All textures will be created during the game's loading phase.

## Requirements

- Generate circle and triangle textures during game loading
- Support different sizes and colors for all shapes
- Organize textures for easy retrieval
- Show loading progress to the player

## Implementation Advice

### Shape Texture Creation

- Create a unified `TextureGenerator` class that handles all shape texture creation
- Use Phaser's Graphics API for optimal rendering performance
- Apply consistent naming patterns for all textures (e.g., `circle_[radius]_[color]`, `triangle_[size]_[color]`)
- Implement proper texture management with Phaser's built-in cache

### Using Phaser's Graphics API

```typescript
// Creating a circle texture with Phaser
function createCircleTexture(
  scene: Phaser.Scene,
  radius: number,
  color: number
): string {
  // Use Phaser's graphics object for hardware-accelerated rendering
  const graphics = scene.make.graphics({ x: 0, y: 0 });

  // Use Phaser's fill method
  graphics.fillStyle(color);
  graphics.fillCircle(radius, radius, radius);

  // Generate the texture with Phaser's texture manager
  const key = `circle_${radius}_${color.toString(16)}`;
  graphics.generateTexture(key, radius * 2, radius * 2);

  return key;
}

// Creating a triangle texture with Phaser
function createTriangleTexture(
  scene: Phaser.Scene,
  size: number,
  color: number
): string {
  const graphics = scene.make.graphics({ x: 0, y: 0 });
  graphics.fillStyle(color);

  // Calculate dimensions for equilateral triangle
  const height = (size * Math.sqrt(3)) / 2;

  // Use Phaser's path API
  graphics.beginPath();
  graphics.moveTo(size / 2, 0); // Top
  graphics.lineTo(0, height); // Bottom left
  graphics.lineTo(size, height); // Bottom right
  graphics.closePath();
  graphics.fillPath();

  // Register with Phaser's texture system
  const key = `triangle_${size}_${color.toString(16)}`;
  graphics.generateTexture(key, size, height);

  return key;
}
```

### Game Integration Best Practices

- Generate common texture sizes during the preload phase
- Leverage Phaser's loading events for progress reporting
- Use the texture manager to check for existing textures before creation

```typescript
// Example usage with Phaser's texture system
function getShapeTexture(
  scene: Phaser.Scene,
  shape: "circle" | "triangle",
  params: ShapeParams
): string {
  // Build consistent key for texture lookup
  const key = `${shape}_${params.size}_${params.color.toString(16)}`;

  // Use Phaser's cache system
  if (!scene.textures.exists(key)) {
    if (shape === "circle") {
      createCircleTexture(scene, params.size, params.color);
    } else {
      createTriangleTexture(scene, params.size, params.color);
    }
  }

  return key;
}
```

## Performance Optimization

- **DO** use Phaser's texture atlas system for related shapes
- **DO** generate textures in batches during scene loading
- **DON'T** regenerate textures that are already in the cache
- **DON'T** create textures during gameplay unless absolutely necessary

## Memory Management

```typescript
// Proper texture cleanup with Phaser
scene.events.once("shutdown", () => {
  // Remove textures when they're no longer needed
  generatedTextureKeys.forEach((key) => {
    if (scene.textures.exists(key)) {
      scene.textures.remove(key);
    }
  });
});
```
