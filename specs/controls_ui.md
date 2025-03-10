# Controls and UI

## Movement Controls

- **Keys**: WASD
- **Functionality**: Move the player character in all four directions
- **Design Consideration**: Direct control allows for action gameplay alongside tower defense

## Combat and Interaction Modes

- **Mode Switching**: F key toggles between attack and interaction modes
- **Indication**: Visual feedback to show current mode

### Attack Mode

- **Action**: Left-click
- **Functionality**: Attack enemies directly
- **Visual Feedback**: Attack animation playing

### Interaction Mode

- **Action**: Left-click
- **Functionality**:
  - Click on build menu to select towers
  - Click on ground to place selected tower
  - Click on tower to open tower menu
  - Click on diplomat to open diplomat menu
- **Visual Feedback**: Appropriate UI elements appear when clicking on interactive objects

## Build System UI

- **Activation**: Accessible in interaction mode
- **Components**:
  - Tower selection buttons
  - Soul counter display
  - Tower cost indicators
- **Functionality**:
  - Select tower types for building
  - Display current soul count
  - Visual feedback when insufficient souls

## Tower Menu UI

- **Activation**: Click on tower in interaction mode
- **Components**:
  - Sell button
  - Tower information
- **Functionality**: Allows selling towers for repositioning

## Diplomat Menu UI

- **Activation**: Click on diplomat in interaction mode
- **Components**:
  - Quest acceptance button
  - Quest status display
  - Target selection for cooperating camps
- **Functionality**:
  - Accept quests from diplomats
  - Check quest status
  - Direct cooperating camps to attack specific targets

## Game Status UI

- **Camp Status Indicators**:
  - White arrow: Currently spawning wave
  - Red marking: Current quest target
  - Big X: Destroyed camp
  - "C" symbol: Cooperating camp
  - Colored arrow: Target direction for cooperating camp's waves

## Soul Counter UI

- **Display**: Shows current soul count
- **Updates**: In real-time as souls are gained and spent
- **Visual Feedback**: Highlighting when gaining souls

## UI Design Considerations

- Based on user testing, moved from mode-based keyboard controls to a more intuitive click-based interface
- Follows RTS (Real-Time Strategy) conventions for unit selection and building
- Selection bars appear when a unit is selected, providing interaction options
- Mode-switching is minimized but still required for separating attack and interaction functionality

## UI Transition History

- **Initial Design**: Heavy reliance on keyboard modes (similar to "Orcs Must Die!")
- **Testing Feedback**: Users found the mode system confusing
- **Research Insight**: Research on UI design principles suggested mode-based interfaces are mainly effective for expert users
- **Current Design**: Click-based interface with minimal mode switching, following RTS conventions that aligned with user expectations
