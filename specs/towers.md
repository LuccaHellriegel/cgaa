# Towers

## Tower System Overview

- **Purpose**: Provide automated defense and support capabilities
- **Limitation**: Limited number can be placed at once
- **Placement**: Can be placed anywhere that's not blocked by obstacles
- **Economy**: Built using souls collected from defeating enemies
- **Management**: Can be sold for free and repositioned

## Tower Types

### Shooter Tower

- **Cost**: 100 souls
- **Function**: Attacks enemies with projectiles
- **Properties**:
  - Attack Range: Circular area around the tower
  - Damage: Fixed amount per projectile
  - Rate of Fire: Constant rate
  - Targeting: Automatic targeting of enemies in range
- **Strategic Considerations**:
  - Placement to cover approach paths
  - Line of sight considerations (obstacles can block projectiles)
  - Positioning so bullets can reach enemies quickly

### Healer Tower

- **Cost**: 200 souls
- **Function**: Heals player and other towers
- **Properties**:
  - Healing Range: Circular area around the tower
  - Healing Rate: Constant rate
  - Targets: Player and all towers within range
- **Strategic Considerations**:
  - Central placement to cover multiple towers
  - Positioning to ensure player can retreat within range when damaged

## Tower Interaction

- **Selection**: Click on tower in interaction mode to open tower menu
- **Selling**: Option available in tower menu
- **Visual Feedback**: Tower menu UI elements

## Tower Placement Strategy

- **Defensive Positioning**:
  - Place towers to protect the player's base
  - Position towers to cover multiple approach paths
- **Offensive Positioning**:
  - Place towers inside enemy camps to weaken defenses
  - Position towers to attack enemy buildings
- **Support Positioning**:
  - Place healer towers where they can support multiple shooter towers
  - Ensure healing coverage for critical areas

## Tower Limitations

- **Quantity**: Limited total number of towers allowed
- **Projectile Physics**: Shooter towers can be blocked by obstacles
- **Range Limitations**: Defined circular area of effect

## Tower Graphics

- **Appearance**: Distinct shapes to differentiate tower types
- **Animation**: Visual feedback for shooting and healing actions
- **Range Indication**: Visual representation of tower range when selected

## Implementation Notes

- Tower-related physics calculations can be performance-intensive
- Consider using object pooling for tower projectiles
- Ensure tower ranges are clearly communicated to the player visually
