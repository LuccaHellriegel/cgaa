# Combat

## Player Combat

- **Attack Mechanism**: Left-click in attack mode
- **Weapon**: Chain-weapon (a more complex shape similar to an arrow)
- **Range**: Medium range for player attacks
- **Damage**: Variable based on enemy type
- **Targeting**: Direction-based, requires precise aiming
- **Animation**: Visual feedback for attack actions

## Tower Combat

### Shooter Tower

- **Attack Type**: Projectile-based attacks (bullets)
- **Range**: Defined circular area
- **Target Acquisition**: Automatic within range
- **Damage**: Fixed damage per projectile
- **Rate of Fire**: Fixed rate
- **Limitations**: Line of sight, physical obstacles can block projectiles

### Healer Tower

- **Function**: Heals player and other towers within range
- **Range**: Defined circular area
- **Healing Rate**: Fixed rate
- **Target Selection**: All friendly units in range
- **Visual Feedback**: Healing effect animation

## Enemy Combat

- **Attack Type**: Direct contact damage
- **Targeting**: Player and towers
- **Range**: Close range
- **Aggression Triggers**:
  - Player or tower enters line of sight
  - Player attacks enemy
- **Variables**:
  - Damage varies by enemy size/type
  - Attack speed varies by enemy type
- **AI Behavior**: When engaged in combat, enemies prioritize the closest target

## Collision Detection

- **Basic Collision**: Uses Phaser's Arcade Physics
  - Circle vs. Circle
  - Circle vs. Rectangle
- **Complex Collision**: Custom collision detection for complex shapes
  - Chain-weapon uses polygon shapes for precise collision
  - Only activated during attack animations
- **Implementation**: Synchronization of texture position with corresponding polygon shape
- **Optimization**: Separate collision system for specialized cases (like the chain-weapon)

## Line of Sight Mechanics

- **Enemy Awareness**: Defined detection range around enemies
- **Tower Range**: Defined circular area for attack range
- **Implementation**:
  - Moving units have line of sight areas
  - Towers check for enemies in range during update cycles

## Combat Flow

1. Enemies spawn in waves from camps
2. Enemies move toward player's base or other targets
3. If player enters enemy line of sight, they attack
4. Towers automatically engage enemies in range
5. Player can directly attack enemies for souls
6. Healing towers support the player and other towers during combat

## Combat Strategies

- Kill small units quickly for early soul farming
- Position shooter towers to maximize coverage of approach paths
- Place healer towers to support player and other towers
- Build towers inside enemy camps to weaken defenses
- Destroy buildings to reduce the number of enemies in waves
