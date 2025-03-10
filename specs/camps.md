# Camps

## Camp System Overview

- **Purpose**: Enemy bases that generate waves of enemies
- **Count**: Multiple camps attacking simultaneously (four in the original game)
- **Layout**: Randomized camp, building, and guardian setup
- **Status States**:
  - Active (attacking player)
  - Conquered (destroyed)
  - Cooperating (allied with player)

## Camp Components

### Buildings

- **Function**: Generate enemies for waves
- **Sizes**: Different building sizes correspond to different enemy sizes
- **Destruction**: Can be destroyed to reduce wave strength
- **Strategic Value**: Primary targets for reducing enemy strength

### Guardians

- **Function**: Protect camps and buildings
- **Properties**:
  - Larger, stronger enemy units
  - Higher health and damage
- **Behavior**:
  - Patrol within camp
  - Attack player when in range

### Diplomat

- **Function**: Interface for player interaction with the camp
- **Interaction**:
  - Provides quests to the player
  - Allows establishing cooperation
  - Controls wave targeting for cooperating camps

### Exits

- **Function**: Points where enemy waves emerge from the camp
- **Implementation**: Used in path calculation and wall placement

## Camp Status Indicators

- **White Arrow**: Indicates which camp is currently sending a wave
- **Red Marking**: Shows the current quest target camp
- **Big X**: Marks destroyed/conquered camps
- **"C" Symbol**: Indicates cooperating camps
- **Colored Arrow**: Shows where cooperating camps are sending their waves

## Camp Interaction

### Conquest

- **Process**: Destroy buildings and defeat guardians
- **Result**: Camp becomes neutralized (marked with X)
- **Strategic Value**: Reduces the number of active enemy camps

### Cooperation

- **Process**: Accept and complete quest from camp's diplomat
- **Result**:
  - Camp becomes an ally (marked with C)
  - Waves no longer attack player
  - Player can direct waves to attack other camps
- **Management**: Interact with diplomat to change wave targets

## Wave System

- **Generation**: Spawns from camp exits
- **Frequency**: Continuous waves at designated intervals
- **Composition**: Based on building types within the camp
- **Direction**:
  - For enemy camps: Toward player's base
  - For cooperating camps: Toward player-designated targets

## Camp Layout Generation

- **Implementation**: Procedurally generated at game start
- **Components**:
  - Middle points of camps
  - Wall positions
  - Building positions
  - Exit locations
  - Diplomat placement

## Strategic Considerations

- **Priority**: Which camps to attack first or establish cooperation with
- **Building Targeting**: Which buildings to destroy to weaken waves
- **Tower Placement**: Positioning towers inside enemy camps for offense
