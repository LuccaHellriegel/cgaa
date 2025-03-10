# Diplomacy

## Diplomacy System Overview

- **Purpose**: Provide non-combat options for dealing with enemy camps
- **Interface**: Interaction with camp diplomats
- **Core Mechanic**: Quest system for establishing cooperation

## Diplomat Character

- **Location**: One diplomat per camp
- **Appearance**: Distinctive circle within camp
- **Interaction**: Player must use interaction mode and left-click to access

## Diplomat Menu

- **Access**: Only in interaction mode
- **Components**:
  - Quest acceptance option
  - Quest status display
  - Target selection for cooperating camps

## Quest System

### Quest Structure

- **Type**: Destruction quests (destroy rival camps)
- **Target**: One camp designated as the target for destruction
- **Indication**: Red marking on the target camp
- **Status**: Tracked and displayed in diplomat menu
- **Completion**: Destroying the target camp fulfills the quest

### Quest Rewards

- **Cooperation**: Target camp becomes allied with player
- **Wave Control**: Ability to direct the camp's waves
- **Protection**: Camp no longer sends waves against the player

## Cooperation Mechanics

### Establishing Cooperation

- **Process**:
  1. Interact with diplomat
  2. Accept quest to destroy rival camp
  3. Complete quest by destroying the target camp
  4. Return to diplomat to confirm cooperation

### Cooperation Indicators

- **Symbol**: "C" appears on cooperating camps
- **Wave Direction**: Colored arrows show the target direction for the camp's waves

### Wave Direction Control

- **Access**: Through diplomat menu
- **Function**: Select target camp for cooperating camp's waves
- **Strategy**: Direct multiple cooperating camps to focus on a single target

## Strategic Considerations

### Diplomacy vs. Conquest

- **Diplomacy Path**:
  - Slower but preserves camp functionality
  - Turns enemy resources against other enemies
  - Requires completing quests
- **Conquest Path**:
  - Faster elimination of threats
  - Removes camps from play entirely
  - More straightforward but requires more combat

### Alliance Management

- **Target Selection**: Which camps should attack which others
- **Priority**: Which camps to ally with first

## Implementation Notes

- Diplomat interaction should be clearly communicated to players
- Quest status and target indication must be visually obvious
- Cooperation state needs to persistently show on the game map
- Path finding for cooperating camp waves needs to be handled separately from enemy waves
