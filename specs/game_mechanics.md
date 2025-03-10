# Game Mechanics

## Core Loop

1. Player builds towers to defend their base
2. Player fights enemies directly to gain souls
3. Player uses souls to build more towers
4. Player strategically attacks enemy camps
5. Player completes quests for diplomacy
6. Player progresses through all camps to unlock the king

## Souls Economy

- **Collection**:
  - Gained by killing enemies (player or towers)
  - More souls for larger/stronger enemies
- **Usage**:
  - Spending souls to build towers
  - Different tower types cost different amounts
  - Shooter: 100 souls
  - Healer: 200 souls

## Tower System

- **Limitation**: Limited number of towers can be placed
- **Placement**: Towers can be placed anywhere that's not blocked
- **Selling**: Towers can be sold for free and replaced elsewhere
- **Strategy**: Requires careful consideration of placement for maximum effectiveness

## Wave System

- **Source**: Waves spawn from camps
- **Frequency**: Continuous waves with designated timing
- **Indication**: White arrow shows which camp is currently sending a wave
- **Composition**: Mix of enemy types based on camp buildings

## Building System

- **Camp Buildings**:
  - Generate enemies for waves
  - Different building sizes correspond to different enemy sizes
  - Can be destroyed to reduce wave strength

## Line of Sight Mechanics

- **Enemy Awareness**: Enemies can spot the player and other units if they are too close
- **Tower Range**: Towers have a defined range for attacking enemies
- **Detection**: Uses physics hitbox/area types for implementation

## Camp Conquest

- **Process**: Destroy buildings and defeat guardians to conquer a camp
- **Indicator**: Conquered camps are marked with a big X
- **Strategic Value**: Reducing the number of active enemy camps

## Diplomacy System

- **Cooperation**: Established by completing quests
- **Indication**: Cooperating camps marked with a "C"
- **Benefits**:
  - Waves from cooperating camps no longer attack the player
  - Player can direct waves from cooperating camps to attack other camps
- **Wave Direction**: Colored arrows show where cooperating camps send their waves

## Goal Progression

- **Initial Goal**: Survive waves and establish a defensive position
- **Mid Game**: Conquer or establish cooperation with camps
- **Final Goal**: Defeat the king behind the barrier
- **Unlock Condition**: The barrier to the king opens when all camps are either conquered or cooperating
